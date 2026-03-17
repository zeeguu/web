const AVATAR_ASSETS_PATH = "/static/avatars/";
export const AVATAR_CHARACTER_IDS = ["elephant", "cat", "dog", "owl"];
export const AVATAR_IMAGE_MAP = Object.fromEntries(
  AVATAR_CHARACTER_IDS.map((id) => {
    return [id, `${AVATAR_ASSETS_PATH}${id}.svg`];
  }),
);

export const AVATAR_CHARACTER_COLORS = ["#F6D110", "#f09000", "#EA2F14", "#6367FF", "#0D1A63", "#008BFF", "#005F02"];

export const AVATAR_BACKGROUND_COLORS = ["#FFF9C7", "#ffe0b3", "#ffc3b3", "#C9BEFF", "#81A6C6", "#9CD5FF", "#BCD9A2"];

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
