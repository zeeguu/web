import styled from "styled-components";

// Small colored pill that surfaces a lesson's category. Colors mirror
// SessionHistory's activity chips (Reading/Browsing/Audio) so the visual
// language is consistent across activity & lessons. Each palette has a
// dark-mode variant: pale pastels disappear on dark cards, so we swap to a
// deeper background with brighter text.
//
// Shared between the past-lessons list and today's episode card.
export const chipPalette = {
  topic:              { bg: "#e3f2fd", color: "#1565c0", darkBg: "#1e3a52", darkColor: "#90caf9" },  // blue
  situation:          { bg: "#e8f5e9", color: "#2e7d32", darkBg: "#1f3d24", darkColor: "#a5d6a7" },  // green
  three_words_lesson: { bg: "#f3e5f5", color: "#7b1fa2", darkBg: "#3a1f3e", darkColor: "#ce93d8" },  // purple
};

export const LessonTypeChip = styled.span`
  display: inline-block;
  padding: 2px 10px;
  border-radius: 999px;
  font-size: 0.75rem;
  font-weight: 500;
  margin-bottom: 6px;
  background: ${({ $type }) => (chipPalette[$type] || chipPalette.topic).bg};
  color: ${({ $type }) => (chipPalette[$type] || chipPalette.topic).color};

  [data-theme="dark"] & {
    background: ${({ $type }) => (chipPalette[$type] || chipPalette.topic).darkBg};
    color: ${({ $type }) => (chipPalette[$type] || chipPalette.topic).darkColor};
  }
`;

export const chipLabel = (lessonType) => {
  if (lessonType === "situation") return "Situation";
  if (lessonType === "three_words_lesson") return "Vocabulary";
  return "Topic";
};
