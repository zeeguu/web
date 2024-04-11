import * as s from "./ArticleReader.sc";
import strings from "../i18n/definitions";
import { useState } from "react";

export default function LikeFeedbackBox({
  articleInfo,
  setLikedState,
}) {
  const [isHovered, setIsHovered] = useState('');

  const handleMouseEnter = (option) => {
    setIsHovered(option);
  };

  const handleMouseLeave = () => {
    setIsHovered('');
  };
  
  return (
    <s.InvisibleBox>
     
      <h4>{strings.didYouEnjoyMsg}</h4>

      <s.CenteredContent>
        <s.WhiteButton
          onClick={(e) => setLikedState(true)}
          className={articleInfo.liked === true ? "selected" : isHovered === "yes" ? "hovered" : ""}
          onMouseEnter={() => handleMouseEnter("yes")}
          onMouseLeave={() => handleMouseLeave()}
        >
          {strings.yes}
        </s.WhiteButton>
        <s.WhiteButton
          onClick={(e) => setLikedState(false)}
          className={articleInfo.liked === false ? "selected" : isHovered === "no" ? "hovered" : ""}
          onMouseEnter={() => handleMouseEnter("no")}
          onMouseLeave={() => handleMouseLeave()}
        >
          {strings.no}
        </s.WhiteButton>
      </s.CenteredContent>
    </s.InvisibleBox>
  );
}
