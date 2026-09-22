import {
  AlwaysStencilFunc,
  BackSide,
  BoxGeometry,
  BufferGeometry,
  CanvasTexture,
  Color,
  DecrementWrapStencilOp,
  DirectionalLight,
  EdgesGeometry,
  FrontSide,
  Group,
  HemisphereLight,
  IncrementWrapStencilOp,
  LineBasicMaterial,
  LineLoop,
  LineSegments,
  Material,
  Mesh,
  MeshBasicMaterial,
  MeshStandardMaterial,
  NotEqualStencilFunc,
  Object3D,
  OrthographicCamera,
  PCFShadowMap,
  Plane,
  PlaneGeometry,
  RepeatWrapping,
  ReplaceStencilOp,
  Scene,
  SRGBColorSpace,
  Vector3,
  WebGLRenderer,
  BufferAttribute,
} from "three";
import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils.js";
import type { Solid, SolidGroup } from "@/content/models/salt-archive";

/**
 * A white card model of a building, cut by a horizontal section plane.
 * Cut faces are filled with poché using the stencil-capping technique:
 * each closed solid's back faces increment the stencil and its front faces
 * decrement it, so wherever the count is non-zero the plane is "inside"
 * material, and a cap is drawn there.
 *
 * Renders only on demand — when the cut or the viewport changes.
 */

const PALETTE = {
  card: "#f2eee7",
  earth: "#ddd6ca",
  water: "#c3c6c0",
  line: "#2a2926",
  carbon: "#161614",
  stone: "#a39e93",
  vermilion: "#c23b22",
  sky: "#f5f2ec",
};

type GroupStyle = { surface: string; roughness: number; cap: "solid" | "hatch" | "flat"; capColor: string };

const GROUPS: Record<SolidGroup, GroupStyle> = {
  earth: { surface: PALETTE.earth, roughness: 1, cap: "hatch", capColor: PALETTE.earth },
  water: { surface: PALETTE.water, roughness: 0.55, cap: "flat", capColor: "#b3b7b1" },
  building: { surface: PALETTE.card, roughness: 0.92, cap: "solid", capColor: PALETTE.carbon },
};

export type SectionScene = {
  setCut: (y: number) => void;
  resize: (width: number, height: number) => void;
  dispose: () => void;
};

export type SceneOptions = {
  shadows: boolean;
  pixelRatio: number;
  bounds: { x: readonly [number, number]; y: readonly [number, number]; z: readonly [number, number] };
};

function solidGeometry(solid: Solid): BufferGeometry {
  const geometry = new BoxGeometry(...solid.size);
  if (solid.tilt) geometry.rotateZ(solid.tilt);
  geometry.translate(...solid.position);
  return geometry;
}

function merge(geometries: BufferGeometry[]): BufferGeometry {
  const merged = mergeGeometries(geometries, false);
  geometries.forEach((geometry) => geometry.dispose());
  if (!merged) throw new Error("Could not merge model geometry");
  return merged;
}

function hatchTexture(): CanvasTexture {
  const size = 64;
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = size;
  const context = canvas.getContext("2d");
  if (context) {
    context.fillStyle = PALETTE.earth;
    context.fillRect(0, 0, size, size);
    context.strokeStyle = "#8f8a80";
    context.lineWidth = 3;
    context.beginPath();
    // One diagonal, wrapped at the corners, tiles seamlessly.
    context.moveTo(0, size);
    context.lineTo(size, 0);
    context.moveTo(-size / 2, size / 2);
    context.lineTo(size / 2, -size / 2);
    context.moveTo(size / 2, size * 1.5);
    context.lineTo(size * 1.5, size / 2);
    context.stroke();
  }
  const texture = new CanvasTexture(canvas);
  texture.wrapS = texture.wrapT = RepeatWrapping;
  texture.colorSpace = SRGBColorSpace;
  texture.anisotropy = 4;
  return texture;
}

/** Stencil writers for one closed group of solids (see file comment). */
function stencilWriters(geometry: BufferGeometry, plane: Plane, renderOrder: number): Group {
  const group = new Group();
  const base = new MeshBasicMaterial({
    depthWrite: false,
    depthTest: false,
    colorWrite: false,
    stencilWrite: true,
    stencilFunc: AlwaysStencilFunc,
    clippingPlanes: [plane],
  });

  // Material.clone() deep-copies clipping planes, so each writer is given
  // the live plane again — otherwise it would clip against a frozen copy.
  const back = base.clone();
  back.side = BackSide;
  back.clippingPlanes = [plane];
  back.stencilFail = back.stencilZFail = back.stencilZPass = IncrementWrapStencilOp;

  const front = base.clone();
  front.side = FrontSide;
  front.clippingPlanes = [plane];
  front.stencilFail = front.stencilZFail = front.stencilZPass = DecrementWrapStencilOp;
  base.dispose();

  for (const material of [back, front]) {
    const mesh = new Mesh(geometry, material);
    mesh.renderOrder = renderOrder;
    group.add(mesh);
  }
  return group;
}

export function createSectionScene(canvas: HTMLCanvasElement, solids: readonly Solid[], options: SceneOptions): SectionScene {
  const renderer = new WebGLRenderer({
    canvas,
    antialias: true,
    alpha: true,
    stencil: true,
    powerPreference: "low-power",
  });
  renderer.setPixelRatio(options.pixelRatio);
  renderer.localClippingEnabled = true;
  renderer.shadowMap.enabled = options.shadows;
  renderer.shadowMap.type = PCFShadowMap;
  renderer.setClearColor(0x000000, 0);

  const scene = new Scene();
  const camera = new OrthographicCamera(-1, 1, 1, -1, 1, 1000);
  const target = new Vector3(0, -1.5, 0);
  let aspect = 1;

  // The section plane keeps everything below it: y <= cut.
  const plane = new Plane(new Vector3(0, -1, 0), options.bounds.y[1] + 1);

  // ── Light: a soft sky, and one low sun from the south-west
  scene.add(new HemisphereLight(PALETTE.sky, PALETTE.stone, 1.9));
  const sun = new DirectionalLight("#ffffff", 2.1);
  sun.position.set(-60, 90, -70);
  sun.target.position.set(0, 0, 0);
  if (options.shadows) {
    sun.castShadow = true;
    sun.shadow.mapSize.set(2048, 2048);
    sun.shadow.bias = -0.0004;
    sun.shadow.normalBias = 0.02;
    const shadowCamera = sun.shadow.camera;
    shadowCamera.left = -70;
    shadowCamera.right = 70;
    shadowCamera.top = 70;
    shadowCamera.bottom = -70;
    shadowCamera.near = 10;
    shadowCamera.far = 260;
  }
  scene.add(sun, sun.target);

  // ── Model, one merged mesh per group
  const disposables: { dispose: () => void }[] = [];
  const caps: Mesh[] = [];
  const hatch = hatchTexture();
  disposables.push(hatch);

  const groups: SolidGroup[] = ["earth", "water", "building"];
  groups.forEach((groupName, index) => {
    const members = solids.filter((solid) => solid.group === groupName);
    if (members.length === 0) return;
    const style = GROUPS[groupName];

    const geometry = merge(members.map(solidGeometry));
    const edges = merge(
      members.map((solid) => {
        const box = solidGeometry(solid);
        const edge = new EdgesGeometry(box, 25);
        box.dispose();
        return edge;
      }),
    );
    disposables.push(geometry, edges);

    const writers = stencilWriters(geometry, plane, index + 1);
    scene.add(writers);
    writers.traverse((child) => {
      if (child instanceof Mesh) disposables.push(child.material as Material);
    });

    const capMaterial = new MeshBasicMaterial({
      color: style.cap === "hatch" ? "#ffffff" : style.capColor,
      map: style.cap === "hatch" ? hatch : null,
      stencilWrite: true,
      stencilRef: 0,
      stencilFunc: NotEqualStencilFunc,
      stencilFail: ReplaceStencilOp,
      stencilZFail: ReplaceStencilOp,
      stencilZPass: ReplaceStencilOp,
    });
    const capGeometry = new PlaneGeometry(240, 240);
    capGeometry.rotateX(-Math.PI / 2);
    if (style.cap === "hatch") {
      // Scale UVs so one hatch tile spans 1.6 m.
      const uv = capGeometry.getAttribute("uv") as BufferAttribute;
      for (let i = 0; i < uv.count; i++) uv.setXY(i, uv.getX(i) * 150, uv.getY(i) * 150);
    }
    const cap = new Mesh(capGeometry, capMaterial);
    cap.renderOrder = index + 1.1;
    cap.onAfterRender = (activeRenderer) => activeRenderer.clearStencil();
    caps.push(cap);
    scene.add(cap);
    disposables.push(capGeometry, capMaterial);

    const surface = new MeshStandardMaterial({
      color: new Color(style.surface),
      roughness: style.roughness,
      metalness: 0,
      clippingPlanes: [plane],
      clipShadows: true,
      polygonOffset: true,
      polygonOffsetFactor: 1,
      polygonOffsetUnits: 1,
    });
    const mesh = new Mesh(geometry, surface);
    mesh.castShadow = options.shadows && groupName === "building";
    mesh.receiveShadow = options.shadows;
    mesh.renderOrder = 10;
    scene.add(mesh);

    const lineMaterial = new LineBasicMaterial({
      color: PALETTE.line,
      transparent: true,
      opacity: groupName === "building" ? 0.5 : 0.28,
      clippingPlanes: [plane],
    });
    const lines = new LineSegments(edges, lineMaterial);
    lines.renderOrder = 11;
    scene.add(lines);
    disposables.push(surface, lineMaterial);
  });

  // ── The cutting plane itself, drawn as a vermilion frame around the site
  const [x0, x1] = options.bounds.x;
  const [z0, z1] = options.bounds.z;
  const pad = 2.5;
  const frameGeometry = new BufferGeometry().setFromPoints([
    new Vector3(x0 - pad, 0, z0 - pad),
    new Vector3(x1 + pad, 0, z0 - pad),
    new Vector3(x1 + pad, 0, z1 + pad),
    new Vector3(x0 - pad, 0, z1 + pad),
  ]);
  const frameMaterial = new LineBasicMaterial({ color: PALETTE.vermilion });
  const frame = new LineLoop(frameGeometry, frameMaterial);
  frame.renderOrder = 12;
  scene.add(frame);
  disposables.push(frameGeometry, frameMaterial);

  // ── Camera: axonometric, framed to the site block
  function fitCamera() {
    // Landscape frames look across the long side; portrait frames look along it.
    const azimuth = aspect >= 1 ? Math.PI * 0.26 : Math.PI * 0.12;
    const direction = new Vector3(Math.cos(azimuth), aspect >= 1 ? 0.72 : 1.0, -Math.sin(azimuth)).normalize();
    camera.position.copy(target).addScaledVector(direction, 300);
    camera.up.set(0, 1, 0);
    camera.lookAt(target);
    camera.updateMatrixWorld();

    const right = new Vector3().setFromMatrixColumn(camera.matrixWorld, 0);
    const up = new Vector3().setFromMatrixColumn(camera.matrixWorld, 1);
    let minR = Infinity;
    let maxR = -Infinity;
    let minU = Infinity;
    let maxU = -Infinity;
    const corner = new Vector3();
    for (const x of options.bounds.x)
      for (const y of options.bounds.y)
        for (const z of options.bounds.z) {
          corner.set(x, y, z).sub(target);
          const r = corner.dot(right);
          const u = corner.dot(up);
          minR = Math.min(minR, r);
          maxR = Math.max(maxR, r);
          minU = Math.min(minU, u);
          maxU = Math.max(maxU, u);
        }

    const padding = 1.06;
    let width = (maxR - minR) * padding;
    let height = (maxU - minU) * padding;
    if (width / height > aspect) height = width / aspect;
    else width = height * aspect;
    const centreR = (minR + maxR) / 2;
    const centreU = (minU + maxU) / 2;
    camera.left = centreR - width / 2;
    camera.right = centreR + width / 2;
    camera.top = centreU + height / 2;
    camera.bottom = centreU - height / 2;
    camera.near = 1;
    camera.far = 700;
    camera.updateProjectionMatrix();
  }

  let frameRequest = 0;
  function requestRender() {
    if (frameRequest) return;
    frameRequest = requestAnimationFrame(() => {
      frameRequest = 0;
      renderer.render(scene, camera);
    });
  }

  function setCut(y: number) {
    plane.constant = y;
    for (const cap of caps) cap.position.y = y;
    frame.position.y = y;
    requestRender();
  }

  function resize(width: number, height: number) {
    if (width === 0 || height === 0) return;
    aspect = width / height;
    renderer.setSize(width, height, false);
    fitCamera();
    requestRender();
  }

  function dispose() {
    cancelAnimationFrame(frameRequest);
    scene.traverse((object: Object3D) => {
      if (object instanceof DirectionalLight) object.shadow.map?.dispose();
    });
    disposables.forEach((item) => item.dispose());
    renderer.dispose();
    renderer.forceContextLoss();
  }

  return { setCut, resize, dispose };
}
