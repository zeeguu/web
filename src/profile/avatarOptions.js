export const AVATAR_IMAGES = [
  { id: "elephant", src: "/static/avatars/elephant.svg" },
  { id: "owl", src: "/static/avatars/owl.svg" },
  { id: "wolf", src: "/static/avatars/wolf.svg" },
];

export const AVATAR_CHARACTER_COLORS = ["#1e3a5f", "#b91c1c", "#047857", "#7c3aed", "#c2410c", "#0e7490", "#6d28d9"];

export const AVATAR_BACKGROUND_COLORS = ["#dbeafe", "#fce7f3", "#d1fae5", "#fef3c7", "#ede9fe", "#fee2e2", "#e0e7ff"];

const AVATAR_CHARACTER_STORAGE_KEY = "zeeguu_avatar_character_id";
const AVATAR_CHARACTER_COLOR_STORAGE_KEY = "zeeguu_avatar_character_color";
const AVATAR_BACKGROUND_COLOR_STORAGE_KEY = "zeeguu_avatar_background_color";

export function getSavedCharacterId() {
  return localStorage.getItem(AVATAR_CHARACTER_STORAGE_KEY) || AVATAR_IMAGES[0].id;
}

export function saveCharacterId(id) {
  localStorage.setItem(AVATAR_CHARACTER_STORAGE_KEY, id);
}

export function getSavedCharacterColor() {
  return localStorage.getItem(AVATAR_CHARACTER_COLOR_STORAGE_KEY) || AVATAR_CHARACTER_COLORS[0];
}

export function saveCharacterColor(color) {
  localStorage.setItem(AVATAR_CHARACTER_COLOR_STORAGE_KEY, color);
}

export function getSavedBackgroundColor() {
  return localStorage.getItem(AVATAR_BACKGROUND_COLOR_STORAGE_KEY) || AVATAR_BACKGROUND_COLORS[0];
}

export function saveCharacterBackgroundColor(color) {
  localStorage.setItem(AVATAR_BACKGROUND_COLOR_STORAGE_KEY, color);
}

export function getAvatarImageById(id) {
  return AVATAR_IMAGES.find((a) => a.id === id) || AVATAR_IMAGES[0];
}
