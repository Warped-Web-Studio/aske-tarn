import type { Project } from "@/lib/types";

import saltExterior from "./images/salt-archive/exterior.jpg";
import saltRamp from "./images/salt-archive/ramp.jpg";
import saltRooflight from "./images/salt-archive/rooflight.jpg";
import saltFins from "./images/salt-archive/fins.jpg";
import saltWall from "./images/salt-archive/wall.jpg";
import saltStair from "./images/salt-archive/stair.jpg";
import saltConcrete from "./images/salt-archive/concrete.jpg";
import saltSoffit from "./images/salt-archive/soffit.jpg";

import hollinSea from "./images/hollin-house/sea.jpg";
import hollinFrame from "./images/hollin-house/frame.jpg";
import hollinCourt from "./images/hollin-house/court.jpg";
import hollinCliff from "./images/hollin-house/cliff.jpg";

import bregagliaRefuge from "./images/bregaglia/refuge.jpg";
import bregagliaValley from "./images/bregaglia/valley.jpg";
import bregagliaPassage from "./images/bregaglia/passage.jpg";
import bregagliaWalls from "./images/bregaglia/walls.jpg";

import umbraDunes from "./images/casa-umbra/dunes.jpg";
import umbraInterior from "./images/casa-umbra/interior.jpg";
import umbraEarth from "./images/casa-umbra/earth.jpg";
import umbraDusk from "./images/casa-umbra/dusk.jpg";

import lanternaStone from "./images/lanterna/stone.jpg";
import lanternaStair from "./images/lanterna/stair.jpg";
import lanternaArcade from "./images/lanterna/arcade.jpg";
import lanternaTerrace from "./images/lanterna/terrace.jpg";

import naveHall from "./images/nave/hall.jpg";
import naveRoom from "./images/nave/room.jpg";
import naveOculus from "./images/nave/oculus.jpg";

import thresholdLattice from "./images/threshold/lattice.jpg";
import thresholdLegs from "./images/threshold/legs.jpg";
import thresholdSawtooth from "./images/threshold/sawtooth.jpg";

/**
 * The practice's work, in the order the monograph presents it.
 * The first entry is the flagship: it opens the site and carries the
 * section model and plan drawing.
 */
export const projects: readonly Project[] = [
  {
    slug: "the-salt-archive",
    number: "AT-021",
    name: "The Salt Archive",
    type: "Cultural",
    programme: "Maritime archive and public reading rooms",
    region: "Limfjord, North Jutland",
    country: "Denmark",
    coordinates: { lat: 56.9712, lng: 8.7034 },
    years: { start: 2019, end: 2024 },
    status: "Completed",
    area: 4860,
    levels: "3 above ground, 2 below",
    dimension: { label: "Length of the long wall", metres: 72.4 },
    structure: "In-situ concrete, post-tensioned roof beams",
    summary:
      "An archive set half below the ground line, where the collection is kept by mass rather than machinery.",
    intro:
      "The site is a strip of reclaimed land barely a metre above the fjord. The brief asked for a building that could keep paper, rope and timber stable for centuries. We answered with weight: a long concrete wall that holds the public rooms above the ground line and the collection below it, where the earth keeps the temperature almost constant through the year.",
    narrative: [
      {
        ref: "S-01",
        heading: "Mass instead of machinery",
        body: [
          "Archives are usually sealed boxes kept stable by plant rooms. Here, walls 900 millimetres thick and two storeys of earth do most of that work. The vaults sit below the water table inside a watertight concrete tank, so the collection lives in the ground's own slow climate.",
          "Mechanical systems remain, but as a correction rather than a life-support machine. The building is designed to fail gently: if the power goes, the rooms drift by a degree over a week, not an afternoon.",
        ],
      },
      {
        ref: "S-02",
        heading: "Descending into the collection",
        body: [
          "A single ramp turns down through the building, from the entrance at the ground line to the reading room and then to the vault doors. The public route and the archive's route are the same; visitors pass the conservation studio through a long internal window on the way down.",
          "The section is the whole idea. Above ground, the building is open to the fjord and the weather. Below it, the rooms become quieter, darker and heavier, until the only light is the light you carry in.",
        ],
      },
      {
        ref: "S-03",
        heading: "Light by the measure",
        body: [
          "The reading room is lit entirely from above, through cast-glass rooflights set in the depth of the roof beams. The beams are deep enough that direct sun never reaches the tables; what arrives is north sky, reflected twice off lime plaster.",
          "In winter, when the fjord light is low and grey, the rooflights hold the brightness of the whole sky. In summer they shade themselves.",
        ],
      },
    ],
    materials: [
      {
        code: "M-01",
        name: "Board-marked concrete",
        spec: "Douglas fir shuttering, 120 mm boards, pigmented with ground chalk from the site",
        photo: { src: saltConcrete, alt: "Close view of fair-faced concrete with tie holes, cut by a hard diagonal shadow." },
      },
      {
        code: "M-02",
        name: "Lime plaster",
        spec: "Three-coat hydraulic lime, hand-trowelled, left unpainted",
        photo: { src: saltWall, alt: "A vast pale plaster wall with a thin steel stair climbing across it.", focus: "70% 50%" },
      },
      {
        code: "M-03",
        name: "Cast glass",
        spec: "Channel-section rooflights, 40 mm, set in the depth of the roof beams",
        photo: { src: saltRooflight, alt: "Rooflights running the length of a narrow white passage.", focus: "50% 10%" },
      },
      {
        code: "M-04",
        name: "Oak",
        spec: "End-grain blocks to the reading room floor, oiled; reading tables in quarter-sawn oak",
      },
    ],
    hero: {
      src: saltExterior,
      alt: "Corner of a board-marked concrete volume rising against an overcast sky, narrow window slots set flush in the wall.",
      focus: "48% 40%",
    },
    gallery: [
      { src: saltRamp, alt: "A curved concrete ramp sweeping around a dim, double-height interior." },
      { src: saltStair, alt: "Concrete stairs rising in parallel through a dark shaft, lit from above." },
      { src: saltFins, alt: "Deep concrete fins casting diagonal shadows across a pale wall." },
      { src: saltRooflight, alt: "A narrow top-lit passage between white walls, a bridge crossing over dark water.", focus: "50% 60%" },
      { src: saltSoffit, alt: "A curved concrete soffit meeting a wall of evenly spaced tie holes." },
    ],
  },
  {
    slug: "hollin-house",
    number: "AT-024",
    name: "Hollin House",
    type: "Residential",
    programme: "Private house on an Atlantic headland",
    region: "Costa da Morte, Galicia",
    country: "Spain",
    coordinates: { lat: 43.1648, lng: -9.2105 },
    years: { start: 2022 },
    status: "On site",
    area: 410,
    levels: "2",
    dimension: { label: "Cantilever over the headland", metres: 9.6 },
    structure: "Pigmented concrete frame and walls",
    summary:
      "A house that turns its back on the ocean, and opens to it through a single long window.",
    intro:
      "The coast here is named for its shipwrecks. Wind from the Atlantic arrives with salt and rain for most of the year. The house is conceived as a shelter first: a thick red wall toward the sea, a sheltered court on the landward side, and one horizontal opening, 14 metres long, that frames the horizon from the living room.",
    narrative: [
      {
        ref: "S-01",
        heading: "The colour of the cliff",
        body: [
          "The concrete is pigmented with iron oxide sampled from the rock at the foot of the headland. It will weather unevenly, darker where rain runs and paler where it doesn't, as the cliff does.",
        ],
      },
      {
        ref: "S-02",
        heading: "A court against the wind",
        body: [
          "Every room opens to a walled court, three metres below the crest of the headland. On days when the terrace is unusable, the court is still, and the sky is the only view.",
        ],
      },
    ],
    materials: [
      { code: "M-01", name: "Pigmented concrete", spec: "Iron-oxide pigment matched to the headland rock, sand-blasted finish" },
      { code: "M-02", name: "Granite", spec: "Paving and steps cut from stone excavated on site" },
      { code: "M-03", name: "Bronze", spec: "Window frames and door furniture, left to darken" },
    ],
    hero: { src: hollinSea, alt: "A red pigmented concrete parapet at the edge of a calm, deep-blue sea.", focus: "70% 50%" },
    gallery: [
      { src: hollinFrame, alt: "The concrete frame of the house under construction on a dry headland above the sea." },
      { src: hollinCourt, alt: "A walled concrete court open to the sky, a single slot framing the blue beyond." },
      { src: hollinCliff, alt: "A house perched on a red rock cliff above a beach, the waves softened by long exposure." },
    ],
  },
  {
    slug: "refuge-bregaglia",
    number: "AT-012",
    name: "Refuge at Bregaglia",
    type: "Hospitality",
    programme: "Mountain refuge, twelve beds",
    region: "Val Bregaglia, Graubünden",
    country: "Switzerland",
    coordinates: { lat: 46.3398, lng: 9.5911 },
    years: { start: 2017, end: 2020 },
    status: "Completed",
    area: 290,
    levels: "3",
    dimension: { label: "Height from rock to ridge", metres: 11.2 },
    structure: "Concrete with granite aggregate; larch interior lining",
    summary:
      "A refuge built in three summers, designed to sit among the boulders as if it had fallen there.",
    intro:
      "The site can be reached on foot in four hours, or by helicopter in the few weeks when the weather allows. Every element of the refuge was sized to that constraint: the concrete was mixed with granite crushed from the site, and the interior was prefabricated in larch panels no heavier than a single lift.",
    narrative: [
      {
        ref: "S-01",
        heading: "A stone among stones",
        body: [
          "From the valley the refuge is almost invisible. Its grey is the grey of the moraine, and its pitched roof takes the angle of the surrounding scree.",
        ],
      },
      {
        ref: "S-02",
        heading: "Warmth in the centre",
        body: [
          "The plan places a single stove and the stair at the centre, with bunks arranged around them in timber alcoves. Heat rises through the building; the outer rooms stay cool, as they should.",
        ],
      },
    ],
    materials: [
      { code: "M-01", name: "Granite-aggregate concrete", spec: "Aggregate crushed from site rock, bush-hammered to expose it" },
      { code: "M-02", name: "Larch", spec: "Prefabricated interior panels, unfinished" },
      { code: "M-03", name: "Zinc", spec: "Standing-seam roof, pre-weathered" },
    ],
    hero: { src: bregagliaRefuge, alt: "A small pitched-roof refuge clad in weathered grey among granite boulders.", focus: "35% 55%" },
    gallery: [
      { src: bregagliaValley, alt: "Low cloud over a mountain valley, a small building on the open slope below." },
      { src: bregagliaPassage, alt: "A narrow concrete passage with stairs overhead, lit in bands from one side." },
      { src: bregagliaWalls, alt: "Concrete walls and stairs stepping up against a clear blue sky." },
    ],
  },
  {
    slug: "casa-umbra",
    number: "AT-019",
    name: "Casa Umbra",
    type: "Residential",
    programme: "Courtyard house for a family of astronomers",
    region: "Atacama",
    country: "Chile",
    coordinates: { lat: -24.1412, lng: -69.9338 },
    years: { start: 2020, end: 2023 },
    status: "Completed",
    area: 520,
    levels: "1, with sunken court",
    dimension: { label: "Width of the shaded court", metres: 18 },
    structure: "Rammed earth, 600 mm; timber roof",
    summary:
      "In one of the brightest places on earth, a house made primarily of shade.",
    intro:
      "The clients observe the sky for a living, and asked for a house that was dark at night and cool by day. The walls are rammed from the earth excavated for the court, 600 millimetres thick. Rooms face inward. The only openings to the desert are narrow and deep, so sunlight enters as a line rather than a flood.",
    narrative: [
      {
        ref: "S-01",
        heading: "Shade as a material",
        body: [
          "We drew the house as a sequence of shadows before we drew its walls: the morning shadow on the court, the long afternoon bar across the living room, the complete darkness of the observation terrace at night.",
        ],
      },
      {
        ref: "S-02",
        heading: "Earth from the court",
        body: [
          "Every tonne of earth removed to sink the court was returned to the walls. The layers of each day's ramming remain visible, a record of the construction in the colour of the ground beneath it.",
        ],
      },
    ],
    materials: [
      { code: "M-01", name: "Rammed earth", spec: "Site soil, 6% lime stabilised, 600 mm walls in 150 mm lifts" },
      { code: "M-02", name: "Algarrobo", spec: "Roof structure and shutters in local mesquite" },
      { code: "M-03", name: "Lime wash", spec: "Interior soffits only, to throw light deeper into rooms" },
    ],
    hero: { src: umbraDunes, alt: "A cluster of earth-coloured volumes and a single tower half-buried in desert sand.", focus: "50% 70%" },
    gallery: [
      { src: umbraInterior, alt: "Sunlight falling in long bars across a sand-covered floor inside an open room." },
      { src: umbraEarth, alt: "A layered earth wall standing on a flat desert plain." },
      { src: umbraDusk, alt: "Rust-red walls of a low house seen through trees in the late sun." },
    ],
  },
  {
    slug: "hotel-lanterna",
    number: "AT-015",
    name: "Hotel Lanterna",
    type: "Hospitality",
    programme: "Twenty-four rooms in a restored cave settlement",
    region: "Basilicata",
    country: "Italy",
    coordinates: { lat: 40.6642, lng: 16.6043 },
    years: { start: 2016, end: 2022 },
    status: "Completed",
    area: 3150,
    levels: "5, stepped into the ravine",
    dimension: { label: "Depth of the deepest room into rock", metres: 26 },
    structure: "Existing calcarenite; new work in concrete poured against stone",
    summary:
      "A hotel carved into a ravine wall, lit at night like a line of lanterns.",
    intro:
      "The rooms were once dwellings dug into the soft stone of the ravine, abandoned in the last century. We kept every surface that could be kept. New work is limited to what the rock could not do: concrete stairs, thresholds and terraces, poured directly against the stone so the two materials meet without a joint.",
    narrative: [
      {
        ref: "S-01",
        heading: "Adding as little as possible",
        body: [
          "Each room received three new things: a floor, a bathroom, and a lantern. Everything else was cleaned, consolidated and left. The hotel's character is the ravine's, not ours.",
        ],
      },
      {
        ref: "S-02",
        heading: "The lanterns",
        body: [
          "At night, each room's entrance is lit by a single deep-set lamp. From across the ravine, the hotel reads as a line of small warm lights in the rock face, the way the settlement looked when it was inhabited.",
        ],
      },
    ],
    materials: [
      { code: "M-01", name: "Calcarenite", spec: "Existing rock faces, cleaned and consolidated with lime" },
      { code: "M-02", name: "Concrete", spec: "Poured against the rock, aggregate matched to the local stone" },
      { code: "M-03", name: "Blackened steel", spec: "Lanterns, handrails and door frames" },
    ],
    hero: { src: lanternaStone, alt: "A rough stone wall with a single deep-set window beneath olive branches.", focus: "50% 55%" },
    gallery: [
      { src: lanternaStair, alt: "A narrow stone stair lit warm at the top of a dark stairwell." },
      { src: lanternaArcade, alt: "A shadowed arcade of heavy piers, a pool of sunlight on the floor." },
      { src: lanternaTerrace, alt: "A board-marked concrete stair curving beneath a deep overhanging roof." },
    ],
  },
  {
    slug: "nave-gallery",
    number: "AT-023",
    name: "Nave",
    type: "Gallery",
    programme: "Contemporary art gallery, one room",
    region: "Seoul",
    country: "South Korea",
    coordinates: { lat: 37.5446, lng: 127.0021 },
    years: { start: 2022, end: 2025 },
    status: "Completed",
    area: 1980,
    levels: "1 hall, 1 below",
    dimension: { label: "Clear span of the hall", metres: 24 },
    structure: "White concrete walls; steel roof trusses",
    summary:
      "One room, 24 metres wide, lit by a continuous run of rooflights.",
    intro:
      "The gallery's director asked for a room that would never compete with the work. Nave is one hall with no columns, no visible services and no windows at eye level. Light comes from a single strip of north-facing rooflights, diffused by a laylight so that the room's brightness follows the weather outside.",
    narrative: [
      {
        ref: "S-01",
        heading: "The room follows the sky",
        body: [
          "There is no artificial light in the hall during the day. On a dull afternoon the room is dull. We think this is honest, and so do the artists.",
        ],
      },
    ],
    materials: [
      { code: "M-01", name: "White concrete", spec: "White cement and marble aggregate, lightly acid-etched" },
      { code: "M-02", name: "Laylight", spec: "Tensioned translucent fabric beneath the rooflights" },
      { code: "M-03", name: "Screed", spec: "Dark power-floated screed, sealed" },
    ],
    hero: { src: naveHall, alt: "A long white gallery under a continuous run of rooflights, empty but for a handrail." },
    gallery: [
      { src: naveRoom, alt: "A tall white room lit by a rooflight above a dark floor." },
      { src: naveOculus, alt: "A spiralling concrete interior looking up to an oval rooflight." },
    ],
  },
  {
    slug: "threshold-pavilion",
    number: "AT-025",
    name: "Threshold Pavilion",
    type: "Pavilion",
    programme: "Temporary pavilion for a summer programme",
    region: "Kyoto",
    country: "Japan",
    coordinates: { lat: 35.0116, lng: 135.7681 },
    years: { start: 2025, end: 2025 },
    status: "Temporary",
    area: 140,
    levels: "Single canopy",
    dimension: { label: "Span of the gridshell", metres: 16.8 },
    structure: "Steel gridshell on four cast-concrete feet",
    summary:
      "A roof that holds nothing but rain, gathering it to one point at its centre.",
    intro:
      "Built for ten weeks and dismantled without leaving a mark, the pavilion was a test of how little a shelter needs to be. A single steel gridshell funnels to its lowest point at the centre, where rain falls in a column onto a basin of river stones. Under it, the edges of the ground plane become thresholds, not walls.",
    narrative: [
      {
        ref: "S-01",
        heading: "A study, not a monument",
        body: [
          "The gridshell was assembled from 1,240 straight members and demounted into the same members. It is being re-erected, unchanged, as a covered market.",
        ],
      },
    ],
    materials: [
      { code: "M-01", name: "Steel", spec: "40 mm hollow sections, bolted nodes, galvanised" },
      { code: "M-02", name: "Cast concrete", spec: "Four precast feet, set on the ground without foundations" },
      { code: "M-03", name: "River stone", spec: "Loose basin at the centre, returned to the river afterwards" },
    ],
    hero: { src: thresholdLattice, alt: "A steel gridshell funnel spreading overhead, seen from beneath." },
    gallery: [
      { src: thresholdLegs, alt: "Angled concrete legs supporting a roof above a shaded ground plane." },
      { src: thresholdSawtooth, alt: "A sawtooth concrete roofline cutting across a deep blue sky." },
    ],
  },
];

export const flagship = projects[0];

export function getProject(slug: string): Project | undefined {
  return projects.find((project) => project.slug === slug);
}

/** The project after this one, wrapping around, for the "next sheet" transition. */
export function getNextProject(slug: string): Project {
  const index = projects.findIndex((project) => project.slug === slug);
  return projects[(index + 1) % projects.length];
}

export const projectTypes = [...new Set(projects.map((project) => project.type))];
