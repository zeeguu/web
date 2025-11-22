import React from "react";

const RARE_RANK_THRESHOLD = 50000;
const VERY_RARE_RANK_THRESHOLD = 100000;

// Badge styles for different phrase types
const badgeStyles = {
  base: {
    marginLeft: "4px",
    fontSize: "0.7em",
    padding: "1px 4px",
    borderRadius: "3px",
    fontWeight: "normal",
  },
  collocation: {
    backgroundColor: "#e8f5e9",
    color: "#2e7d32",
  },
  idiom: {
    backgroundColor: "#fff3e0",
    color: "#e65100",
  },
  expression: {
    backgroundColor: "#f3e5f5",
    color: "#6a1b9a",
  },
  rare: {
    backgroundColor: "#fce4ec",
    color: "#c2185b",
  },
};

/**
 * Displays a badge indicating the phrase type or rarity of a word/phrase
 *
 * @param {Object} props
 * @param {string} props.phraseType - The type from backend: 'SINGLE_WORD', 'COLLOCATION', 'IDIOM', 'EXPRESSION', 'MULTI_WORD'
 * @param {number} props.rank - The word/phrase frequency rank
 * @returns {JSX.Element|null} Badge component or null if no badge should be shown
 */
export default function PhraseTypeBadge({ phraseType, rank }) {
  // Determine what badge to show based on phrase type and rank
  const getBadgeInfo = () => {
    // Normalize phrase type to lowercase for comparison
    const normalizedType = phraseType?.toLowerCase();

    // Show specific badges for classified phrase types
    if (normalizedType === "collocation") {
      return { label: "collocation", style: badgeStyles.collocation };
    }

    if (normalizedType === "idiom") {
      return { label: "idiom", style: badgeStyles.idiom };
    }

    if (normalizedType === "expression") {
      return { label: "expression", style: badgeStyles.expression };
    }

    // For single words or unclassified multi-word phrases, check rarity
    if (normalizedType === "single_word" || normalizedType === "multi_word" || !phraseType) {
      if (rank > VERY_RARE_RANK_THRESHOLD) {
        return { label: "very rare", style: badgeStyles.rare };
      } else if (rank > RARE_RANK_THRESHOLD) {
        return { label: "rare", style: badgeStyles.rare };
      }
    }

    // No badge needed
    return null;
  };

  const badgeInfo = getBadgeInfo();

  if (!badgeInfo) {
    return null;
  }

  return (
    <span
      style={{
        ...badgeStyles.base,
        ...badgeInfo.style,
      }}
      title={`This is a ${badgeInfo.label} ${phraseType === "SINGLE_WORD" ? "word" : "phrase"}`}
    >
      {badgeInfo.label}
    </span>
  );
}
