import { StyledSmallButton, StyledSmallDisabledButton } from "./Buttons.styles";
import { useState } from "react";
import { EXTENSION_SOURCE } from "../constants";
import BookmarkAddOutlinedIcon from "@mui/icons-material/BookmarkAddOutlined";
import BookmarkAddedIcon from "@mui/icons-material/BookmarkAdded";
import BookmarkAddIcon from "@mui/icons-material/BookmarkAdd";
import Tooltip from "@mui/material/Tooltip";

export default function SaveToZeeguu({
  api,
  articleId,
  setPersonalCopySaved,
  personalCopySaved,
}) {
  function handlePostCopy() {
    api.makePersonalCopy(articleId, (message) => console.log(message));
    api.logUserActivity(api.PERSONAL_COPY, articleId, "", EXTENSION_SOURCE);
    setPersonalCopySaved(true);
  }
  const [isHovered, setIsHovered] = useState(false);

  return (
    <>
      {personalCopySaved ? (
        <Tooltip title="Saved to your Zeeguu account" arrow>
          <StyledSmallDisabledButton>
            <BookmarkAddedIcon fontSize="large" /> <br />
            Saved
          </StyledSmallDisabledButton>
        </Tooltip>
      ) : (
        <StyledSmallButton
          onClick={handlePostCopy}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {isHovered ? (
            <BookmarkAddIcon fontSize="large" />
          ) : (
            <BookmarkAddOutlinedIcon fontSize="large" />
          )}{" "}
          <br />
          <span>Save</span>
        </StyledSmallButton>
      )}
    </>
  );
}
