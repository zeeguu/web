import * as s from "./ArticleReader.sc";
import { ChoiceButton } from "../components/ChoiceButton.sc";
import strings from "../i18n/definitions";
import { useState } from "react";
import useTapBounce from "../hooks/useTapBounce";

export default function LikeFeedbackBox({
  articleInfo,
  setLikedState,
}) {
  const [isHovered, setIsHovered] = useState('');
  const { bouncingKey, trigger } = useTapBounce();

  const handleMouseEnter = (option) => {
    setIsHovered(option);
  };

  const handleMouseLeave = () => {
    setIsHovered('');
  };

  const classFor = (key, selected) => {
    const parts = [];
    if (selected) parts.push("selected");
    else if (isHovered === key) parts.push("hovered");
    if (bouncingKey === key) parts.push("tap-bouncing");
    return parts.join(" ");
  };

  const handleClick = (key, value) => {
    trigger(key);
    setLikedState(value);
  };

  return (
    <s.InvisibleBox>

      <h4>{strings.didYouEnjoyMsg}</h4>

      <s.CenteredContent>
        <ChoiceButton
          onClick={() => handleClick("yes", true)}
          className={classFor("yes", articleInfo.liked === true)}
          onMouseEnter={() => handleMouseEnter("yes")}
          onMouseLeave={() => handleMouseLeave()}
        >
          {strings.yes}
        </ChoiceButton>
        <ChoiceButton
          onClick={() => handleClick("no", false)}
          className={classFor("no", articleInfo.liked === false)}
          onMouseEnter={() => handleMouseEnter("no")}
          onMouseLeave={() => handleMouseLeave()}
        >
          {strings.no}
        </ChoiceButton>
      </s.CenteredContent>
    </s.InvisibleBox>
  );
}
