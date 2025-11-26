import { useEffect, useState } from "react";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import FormControl from "@mui/material/FormControl";
import Tooltip from "@mui/material/Tooltip";

// Map CEFR levels to readable labels
// maybe move this to a utils?
  export const getLevelLabel = (level) => {
    const labels = {
      A1: "A1 - Beginner",
      A2: "A2 - Elementary",
      B1: "B1 - Intermediate",
      B2: "B2 - Upper Int.",
      C1: "C1 - Advanced",
      C2: "C2 - Proficient",
    };
    return labels[level] || level;
  };

export default function LevelSwitcher({ currentArticleId, levels, api, onLevelChange, readingTimeEstimate }) {
  const [selectedLevel, setSelectedLevel] = useState(currentArticleId);
  const [isLoading, setIsLoading] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Update selected level when current article changes
  useEffect(() => {
    setSelectedLevel(currentArticleId);
  }, [currentArticleId]);

  const handleLevelChange = (event) => {
    const newArticleId = event.target.value;
    console.log("LevelSwitcher: handleLevelChange called", { newArticleId, currentArticleId });

    if (newArticleId !== currentArticleId) {
      console.log("LevelSwitcher: Level change detected, calling parent callback");
      setIsLoading(true);
      setSelectedLevel(newArticleId);

      // Call the parent's callback to handle level switching
      if (onLevelChange) {
        console.log("LevelSwitcher: Calling onLevelChange callback");
        onLevelChange(newArticleId, () => {
          console.log("LevelSwitcher: Level change completed");
          setIsLoading(false);
        });
      } else {
        console.error("LevelSwitcher: No onLevelChange callback provided");
        setIsLoading(false);
      }
    } else {
      console.log("LevelSwitcher: Same level selected, no change needed");
    }
  };

  // Sort levels alphabetically by CEFR level
  const getSortedLevels = (levels) => {
    if (!levels) return [];

    const cefrOrder = ["A1", "A2", "B1", "B2", "C1", "C2"];

    return [...levels].sort((a, b) => {
      const aLevel = a.cefr_level || "C1";
      const bLevel = b.cefr_level || "C1";

      const aIndex = cefrOrder.indexOf(aLevel);
      const bIndex = cefrOrder.indexOf(bLevel);

      // If both levels are in the standard order, sort by that
      if (aIndex !== -1 && bIndex !== -1) {
        return aIndex - bIndex;
      }

      // Fallback to alphabetical sorting
      return aLevel.localeCompare(bLevel);
    });
  };

  // Don't render anything if there are no levels or only one level
  if (!levels || levels.length <= 1) {
    return null;
  }

  return (
    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
      <Tooltip
        title="Choose reading difficulty level"
        arrow
        placement="top"
        disablePortal
      >
        <FormControl size="small" style={{ minWidth: 120 }}>
          <Select
            value={selectedLevel}
            onChange={handleLevelChange}
            disabled={isLoading}
            onOpen={() => setDropdownOpen(true)}
            onClose={() => setDropdownOpen(false)}
            style={{
              fontSize: "0.85rem",
              backgroundColor: "white",
              height: "32px",
            }}
          >
            {getSortedLevels(levels).map((level) => (
              <MenuItem key={level.id} value={level.id}>
                {level.is_original ? `${level.cefr_level || "C1"} - Original` : getLevelLabel(level.cefr_level)}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Tooltip>
      {readingTimeEstimate && (
        <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
          <span style={{ fontSize: "16px" }}>🕐</span>
          <span>{readingTimeEstimate}</span>
        </div>
      )}
    </div>
  );
}
