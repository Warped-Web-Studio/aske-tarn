import slot from "./images/studio/slot.jpg";
import court from "./images/studio/court.jpg";

/** Practice positions, each keyed to a level in the building section. */
export const principles = [
  {
    level: "+9.60",
    title: "Light",
    text: "We draw light before we draw walls. A room is finished when we know where the sun will be at four in the afternoon in February.",
  },
  {
    level: "+6.20",
    title: "Proportion",
    text: "Most of our decisions are about ratios: the depth of a window to its width, the height of a room to the length of time people will stay in it.",
  },
  {
    level: "+3.00",
    title: "Use",
    text: "A building is judged by the people who clean it, repair it and sit in it on an ordinary Tuesday. We design for them before we design for the photograph.",
  },
  {
    level: "±0.00",
    title: "Landscape",
    text: "Every project starts with the ground. We survey it, walk it and draw it in section before we draw a plan. The building is what the ground line allows.",
  },
  {
    level: "−2.80",
    title: "Material",
    text: "We prefer materials that can age in public — concrete, earth, stone, timber, lime — and we use as few of them as a building will allow.",
  },
  {
    level: "−6.40",
    title: "Permanence",
    text: "We design for a building's second century, not its opening week. Most of what we build is heavy, because heavy things last and change slowly.",
  },
] as const;

export const method = [
  { step: "01", name: "Survey", text: "Walking, measuring and drawing the site as it is, over more than one season." },
  { step: "02", name: "Section", text: "Deciding where the ground line sits, and what belongs above and below it." },
  { step: "03", name: "Material", text: "Choosing the fewest materials, usually from within a day's drive of the site." },
  { step: "04", name: "Detail", text: "Drawing every junction at full size, so nothing is left for the site to improvise." },
] as const;

export const founders = [
  {
    name: "Ingrid Aske",
    role: "Founding partner",
    note: "Leads the practice's cultural and public work. Trained as a structural engineer before turning to architecture.",
  },
  {
    name: "Samuel Tarn",
    role: "Founding partner",
    note: "Leads the residential and hospitality work, and the practice's research into earth construction.",
  },
] as const;

export const studios = [
  { city: "Copenhagen", country: "Denmark", coordinates: { lat: 55.6761, lng: 12.5683 }, role: "Main studio, workshop and model room" },
  { city: "Porto", country: "Portugal", coordinates: { lat: 41.1579, lng: -8.6291 }, role: "Studio for work in southern Europe and South America" },
] as const;

export const studioFacts = [
  { label: "Founded", value: "2011" },
  { label: "People", value: "34" },
  { label: "Studios", value: "2" },
  { label: "Buildings completed", value: "19" },
] as const;

export const studioImages = {
  slot: { src: slot, alt: "A tall slot of sky between two smooth concrete walls." },
  court: { src: court, alt: "A concrete courtyard of stacked volumes, niches and openings." },
} as const;
