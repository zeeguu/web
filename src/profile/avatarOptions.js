import { orange100, orange600 } from "../components/colors";

const AVATAR_ASSETS_PATH = "/static/avatars/";
export const AVATAR_CHARACTER_IDS = ["elephant", "owl", "wolf"];
export const AVATAR_IMAGE_MAP = Object.fromEntries(
  AVATAR_CHARACTER_IDS.map((id) => {
    return [id, `${AVATAR_ASSETS_PATH}${id}.svg`];
  }),
);

export const AVATAR_CHARACTER_COLORS = [
  orange600,
  "#1e3a5f",
  "#b91c1c",
  "#047857",
  "#7c3aed",
  "#c2410c",
  "#0e7490",
  "#6d28d9",
];

export const AVATAR_BACKGROUND_COLORS = [
  orange100,
  "#dbeafe",
  "#fce7f3",
  "#d1fae5",
  "#fef3c7",
  "#ede9fe",
  "#fee2e2",
  "#e0e7ff",
];

export const DEFAULT_AVATAR_CHARACTER_ID = AVATAR_CHARACTER_IDS[0];
export const DEFAULT_AVATAR_CHARACTER_COLOR = AVATAR_CHARACTER_COLORS[0];
export const DEFAULT_AVATAR_BACKGROUND_COLOR = AVATAR_BACKGROUND_COLORS[0];

export function validatedAvatarCharacterId(id) {
  return id && AVATAR_CHARACTER_IDS.includes(id) ? id : DEFAULT_AVATAR_CHARACTER_ID;
}

export function validatedAvatarCharacterColor(color) {
  return color && AVATAR_CHARACTER_COLORS.includes(color) ? color : DEFAULT_AVATAR_CHARACTER_COLOR;
}

export function validatedAvatarBackgroundColor(color) {
  return color && AVATAR_BACKGROUND_COLORS.includes(color) ? color : DEFAULT_AVATAR_BACKGROUND_COLOR;
}
