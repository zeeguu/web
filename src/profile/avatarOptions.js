const AVATAR_ASSETS_PATH = "/static/avatars/";

export const MASCOT_AVATARS = [
  { id: "colibri", label: "Colibri", src: `${AVATAR_ASSETS_PATH}colibri.png` },
  { id: "dragonfly", label: "Dragonfly", src: `${AVATAR_ASSETS_PATH}dragonfly.png` },
  { id: "butterfly", label: "Butterfly", src: `${AVATAR_ASSETS_PATH}butterfly.png` },
  { id: "swan", label: "Swan", src: `${AVATAR_ASSETS_PATH}swan.png` },
  { id: "cat", label: "Cat", src: `${AVATAR_ASSETS_PATH}cat.png` },
  { id: "giraffe", label: "Giraffe", src: `${AVATAR_ASSETS_PATH}giraffe.png` },
  { id: "hippo", label: "Hippo", src: `${AVATAR_ASSETS_PATH}hippo.png` },
  { id: "elephant-book", label: "Reading Elephant", src: `${AVATAR_ASSETS_PATH}elephant-book.png` },
  { id: "elephant-headphones", label: "Headphones Elephant", src: `${AVATAR_ASSETS_PATH}elephant-headphones.png` },
  { id: "elephant-glasses", label: "Coffee & Glasses Elephant", src: `${AVATAR_ASSETS_PATH}elephant-glasses.png` },
  { id: "elephant-kimono", label: "Kimono Elephant", src: `${AVATAR_ASSETS_PATH}elephant-kimono.png` },
  { id: "elephant-beret", label: "Beret Elephant", src: `${AVATAR_ASSETS_PATH}elephant-beret.png` },
].map((item) => ({ ...item, tab: "mascots", kind: "image" }));

export const ZEEGUU_AVATARS = [
  { id: "zeeguu", label: "Classic Zeeguu", layers: [] },
  { id: "zeeguu-blossom", label: "Blossom Zeeguu", layers: ["blossom"] },
  { id: "zeeguu-kimono", label: "Kimono Zeeguu", layers: ["kimono", "blossom"] },
  { id: "zeeguu-headphones", label: "Headphones Zeeguu", layers: ["headphones"] },
  { id: "zeeguu-bowtie", label: "Bowtie Zeeguu", layers: ["bowtie"] },
  { id: "zeeguu-dapper", label: "Headphones & Bowtie Zeeguu", layers: ["bowtie", "headphones"] },
  { id: "zeeguu-newspaper", label: "Newspaper Zeeguu", layers: ["newspaper"] },
  { id: "zeeguu-reader", label: "Avid Reader Zeeguu", layers: ["bowtie", "beret", "newspaper"] },
  { id: "zeeguu-mug", label: "Coffee Mug Zeeguu", layers: ["mug"] },
  { id: "zeeguu-scarf", label: "Scarf Zeeguu", layers: ["scarf"] },
].map((item) => ({ ...item, tab: "zeeguu", kind: "zeeguu" }));

export const WATERCOLOR_AVATARS = [
  { id: "watercolor-colibri", label: "Watercolor Colibri", src: `${AVATAR_ASSETS_PATH}watercolor-colibri.png` },
  { id: "watercolor-dragonfly", label: "Watercolor Dragonfly", src: `${AVATAR_ASSETS_PATH}watercolor-dragonfly.png` },
  { id: "watercolor-butterfly", label: "Watercolor Butterfly", src: `${AVATAR_ASSETS_PATH}watercolor-butterfly.png` },
  { id: "watercolor-cat", label: "Watercolor Cat", src: `${AVATAR_ASSETS_PATH}watercolor-cat.png` },
  { id: "watercolor-giraffe", label: "Watercolor Giraffe", src: `${AVATAR_ASSETS_PATH}watercolor-giraffe.png` },
  { id: "watercolor-hippo", label: "Watercolor Hippo", src: `${AVATAR_ASSETS_PATH}watercolor-hippo.png` },
  { id: "watercolor-owl", label: "Watercolor Owl", src: `${AVATAR_ASSETS_PATH}watercolor-owl.png` },
  { id: "watercolor-fox", label: "Watercolor Fox", src: `${AVATAR_ASSETS_PATH}watercolor-fox.png` },
  {
    id: "watercolor-elephant-headphones",
    label: "Watercolor Headphones Elephant",
    src: `${AVATAR_ASSETS_PATH}watercolor-elephant-headphones.png`,
  },
  {
    id: "watercolor-elephant-reading",
    label: "Watercolor Reading Elephant",
    src: `${AVATAR_ASSETS_PATH}watercolor-elephant-reading.png`,
  },
].map((item) => ({ ...item, tab: "watercolors", kind: "image" }));

export const CLASSIC_AVATAR_IDS = [
  "otter",
  "elephant",
  "wolf",
  "fox",
  "owl",
  "panther",
  "lion",
  "tiger",
  "bear",
  "eagle",
  "rabbit",
  "deer",
  "leopard",
  "cheetah",
  "badger",
  "beaver",
  "lynx",
  "moose",
];

export const CLASSIC_AVATARS = CLASSIC_AVATAR_IDS.map((id) => ({
  id,
  label: id.charAt(0).toUpperCase() + id.slice(1),
  src: `${AVATAR_ASSETS_PATH}${id}.svg`,
  tab: "classic",
  kind: "silhouette",
}));

export const AVATAR_TABS = [
  { id: "mascots", label: "Mascots", items: MASCOT_AVATARS, usesDualToneSwatch: false },
  { id: "zeeguu", label: "Zeeguu", items: ZEEGUU_AVATARS, usesDualToneSwatch: true },
  { id: "watercolors", label: "Watercolors", items: WATERCOLOR_AVATARS, usesDualToneSwatch: false },
  { id: "classic", label: "Classic", items: CLASSIC_AVATARS, usesDualToneSwatch: true },
];

export const ALL_AVATARS = [
  ...MASCOT_AVATARS,
  ...ZEEGUU_AVATARS,
  ...WATERCOLOR_AVATARS,
  ...CLASSIC_AVATARS,
];

const AVATAR_BY_ID = Object.fromEntries(ALL_AVATARS.map((item) => [item.id, item]));

export const AVATAR_CHARACTER_IDS = ALL_AVATARS.map((item) => item.id);

export const AVATAR_IMAGE_MAP = Object.fromEntries(
  ALL_AVATARS.filter((item) => item.src).map((item) => [item.id, item.src]),
);

// Curated paired palettes offered in the picker. Each pair maintains clean contrast
// for classic/Zeeguu icons, soft pastel backdrops for illustrated avatars, and
// readable active username text in the sidebar.
export const AVATAR_PALETTES = [
  { id: "amber", label: "Amber", characterColor: "#D97706", backgroundColor: "#FEF3C7" },
  { id: "terracotta", label: "Terracotta", characterColor: "#C2410C", backgroundColor: "#FFEDD5" },
  { id: "rose", label: "Rose", characterColor: "#E11D48", backgroundColor: "#FFE4E6" },
  { id: "plum", label: "Plum", characterColor: "#7C3AED", backgroundColor: "#EDE9FE" },
  { id: "cobalt", label: "Cobalt", characterColor: "#2563EB", backgroundColor: "#DBEAFE" },
  { id: "teal", label: "Teal", characterColor: "#0D9488", backgroundColor: "#CCFBF1" },
  { id: "forest", label: "Forest", characterColor: "#15803D", backgroundColor: "#DCFCE7" },
  { id: "slate", label: "Slate", characterColor: "#334155", backgroundColor: "#E2E8F0" },
];

// Legacy hexes kept valid so existing users' saved avatars continue to render unchanged.
const LEGACY_AVATAR_CHARACTER_COLORS = [
  "#F6D110",
  "#f09000",
  "#EA2F14",
  "#6367FF",
  "#0D1A63",
  "#008BFF",
  "#005F02",
];

const LEGACY_AVATAR_BACKGROUND_COLORS = [
  "#FFF9C7",
  "#ffe0b3",
  "#ffc3b3",
  "#C9BEFF",
  "#81A6C6",
  "#9CD5FF",
  "#BCD9A2",
];

export const AVATAR_CHARACTER_COLORS = [
  ...AVATAR_PALETTES.map((p) => p.characterColor),
  ...LEGACY_AVATAR_CHARACTER_COLORS,
];

export const AVATAR_BACKGROUND_COLORS = [
  ...AVATAR_PALETTES.map((p) => p.backgroundColor),
  ...LEGACY_AVATAR_BACKGROUND_COLORS,
];

const VALID_CHARACTER_COLOR_MAP = Object.fromEntries(
  AVATAR_CHARACTER_COLORS.map((c) => [c.toLowerCase(), c]),
);
const VALID_BACKGROUND_COLOR_MAP = Object.fromEntries(
  AVATAR_BACKGROUND_COLORS.map((c) => [c.toLowerCase(), c]),
);

export const DEFAULT_AVATAR_CHARACTER_ID = "elephant";
export const DEFAULT_AVATAR_CHARACTER_COLOR = AVATAR_PALETTES[0].characterColor;
export const DEFAULT_AVATAR_BACKGROUND_COLOR = AVATAR_PALETTES[0].backgroundColor;

export function validatedAvatarCharacterId(id) {
  return id && AVATAR_BY_ID[id] ? id : DEFAULT_AVATAR_CHARACTER_ID;
}

export function validatedAvatarCharacterColor(color) {
  if (!color) return DEFAULT_AVATAR_CHARACTER_COLOR;
  return VALID_CHARACTER_COLOR_MAP[color.toLowerCase()] ?? DEFAULT_AVATAR_CHARACTER_COLOR;
}

export function validatedAvatarBackgroundColor(color) {
  if (!color) return DEFAULT_AVATAR_BACKGROUND_COLOR;
  return VALID_BACKGROUND_COLOR_MAP[color.toLowerCase()] ?? DEFAULT_AVATAR_BACKGROUND_COLOR;
}

export function getAvatarOption(id) {
  return AVATAR_BY_ID[validatedAvatarCharacterId(id)];
}

export function getAvatarTabForId(id) {
  return getAvatarOption(id).tab;
}

export function findMatchingPalette(characterColor, backgroundColor) {
  const fg = characterColor?.toLowerCase();
  const bg = backgroundColor?.toLowerCase();
  return (
    AVATAR_PALETTES.find(
      (p) => p.characterColor.toLowerCase() === fg && p.backgroundColor.toLowerCase() === bg,
    ) ?? null
  );
}
