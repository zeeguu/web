/**
 * Get the user's CEFR level for their learned language.
 *
 * @param {Object} userDetails - User details object from UserContext
 * @returns {string} CEFR level string (A1, A2, B1, B2, C1, C2), defaults to "B1"
 */
export function getUserCEFRLevel(userDetails) {
  if (!userDetails?.learned_language) {
    return "B1";
  }

  const levelKey = userDetails.learned_language + "_cefr_level";
  const levelNumber = userDetails[levelKey];

  const levelMap = {
    1: "A1",
    2: "A2",
    3: "B1",
    4: "B2",
    5: "C1",
    6: "C2",
  };

  return levelMap[levelNumber?.toString()] || "B1";
}
