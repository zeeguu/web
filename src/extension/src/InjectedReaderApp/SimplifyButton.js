import { StyledSmallButton, StyledSmallDisabledButton } from "./Buttons.styles";
import { useState } from "react";
import AutoFixHighIcon from "@mui/icons-material/AutoFixHigh";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import Tooltip from "@mui/material/Tooltip";

export default function SimplifyButton({ api, articleId, onLevelsReady, hasExistingLevels, setIsLoadingNewVersion }) {
  const [state, setState] = useState("ready"); // ready | simplifying | done | failed
  
  // Show disabled button if there are already simplified levels
  if (hasExistingLevels) {
    return (
      <Tooltip title="Simplified versions already available" arrow>
        <StyledSmallDisabledButton>
          <CheckCircleIcon fontSize="large" /> <br />
          <span>Simplified</span>
        </StyledSmallDisabledButton>
      </Tooltip>
    );
  }

  const handleClick = () => {
    setState("simplifying");
    
    // Show main loading overlay for simplification
    if (setIsLoadingNewVersion) {
      setIsLoadingNewVersion(true);
    }

    api.simplifyArticle(articleId, (result) => {
      // Hide main loading overlay
      if (setIsLoadingNewVersion) {
        setIsLoadingNewVersion(false);
      }
      
      if (result.status === "success" || result.status === "already_done") {
        setState("done");
        onLevelsReady(result.levels);
      } else if (result.status === "error") {
        console.error("Simplification failed:", result.message);
        setState("failed");
        // Reset to ready after 5 seconds to allow retry
        setTimeout(() => setState("ready"), 5000);
      } else {
        console.error("Unknown simplification response:", result);
        setState("failed");
        setTimeout(() => setState("ready"), 5000);
      }
    });
  };

  // Hide button after successful simplification
  if (state === "done") {
    return (
      <Tooltip title="Simplified versions available" arrow>
        <StyledSmallDisabledButton>
          <CheckCircleIcon fontSize="large" /> <br />
          Simplified
        </StyledSmallDisabledButton>
      </Tooltip>
    );
  }

  if (state === "simplifying") {
    return (
      <Tooltip title="Creating easier reading levels... This may take 30 seconds" arrow>
        <StyledSmallDisabledButton>
          <HourglassEmptyIcon fontSize="large" className="spinning" /> <br />
          Simplifying...
        </StyledSmallDisabledButton>
      </Tooltip>
    );
  }

  if (state === "failed") {
    return (
      <Tooltip title="Simplification failed (timeout or server error). Click to try again" arrow>
        <StyledSmallButton onClick={handleClick}>
          <ErrorOutlineIcon fontSize="large" /> <br />
          Try Again
        </StyledSmallButton>
      </Tooltip>
    );
  }

  return (
    <Tooltip title="Create easier reading levels for this article" arrow>
      <StyledSmallButton onClick={handleClick}>
        <AutoFixHighIcon fontSize="large" /> <br />
        Simplify
      </StyledSmallButton>
    </Tooltip>
  );
}