import {
  StyledSmallButton,
  StyledSmallDisabledButton,
} from "./Buttons.styles";
import { useState } from "react";
import {EXTENSION_SOURCE} from "../constants";
import BeenhereIcon from '@mui/icons-material/Beenhere';
import BeenhereOutlinedIcon from '@mui/icons-material/BeenhereOutlined';
import Tooltip from '@mui/material/Tooltip';

export default function SaveToZeeguu({ api, articleId, setPersonalCopySaved, personalCopySaved}) {
  function handlePostCopy() {
    api.makePersonalCopy(articleId, (message) => console.log(message));
    api.logReaderActivity(api.PERSONAL_COPY, articleId, "", EXTENSION_SOURCE);
    setPersonalCopySaved(true);
  }
  const [isHovered, setIsHovered] = useState(false);

  return (
    <>
      {personalCopySaved ? (
        <Tooltip title="Saved to your Zeeguu account" arrow>
          <StyledSmallDisabledButton>
            <BeenhereIcon fontSize="large"/> <br/>
            Saved
          </StyledSmallDisabledButton>
        </Tooltip>
      ) : (
        <StyledSmallButton onClick={handlePostCopy}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}>
          {isHovered ? <BeenhereIcon fontSize="large"/> : <BeenhereOutlinedIcon fontSize="large"/>} <br/>
          {isHovered ? "Save" : ""}
        </StyledSmallButton>
      )}
    </>
  );
}