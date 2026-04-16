import * as s from "./ArticleReader.sc";

import { useState } from "react";
import styled from "styled-components";
import useTapBounce from "../hooks/useTapBounce";

// "Just right" is the ideal challenge level for language learning — too easy
// or too hard are both suboptimal, so they share the "negative" color.
const COLOR_POSITIVE = "#7fb77f";
const COLOR_NEGATIVE = "#e08a8a";

const FEEDBACK_OPTIONS = [
  { key: "Easy", label: "Too easy", value: 1, color: COLOR_NEGATIVE, emoji: "🥱" },
  { key: "Ok", label: "Just right", value: 3, color: COLOR_POSITIVE, emoji: "😊" },
  { key: "Difficult", label: "Too hard", value: 5, color: COLOR_NEGATIVE, emoji: "😣" },
];

const Emoji = styled.span`
  font-size: 2.2em;
  line-height: 1;
  display: inline-block;
`;

const SemanticButton = styled(s.WhiteButton)`
  && {
    color: ${(p) => p.$color} !important;
    border-color: ${(p) => p.$color} !important;
  }
  && svg {
    color: ${(p) => p.$color} !important;
  }
  &&.selected,
  &&.selected:hover {
    background-color: ${(p) => p.$color} !important;
    border-color: ${(p) => p.$color} !important;
    color: #fff !important;
  }
  &&.selected svg {
    color: #fff !important;
  }
  &&.hovered {
    background-color: ${(p) => p.$color}22 !important;
    border-color: ${(p) => p.$color} !important;
    color: ${(p) => p.$color} !important;
  }
  &&.hovered svg {
    color: ${(p) => p.$color} !important;
  }
`;

export default function DifficultyFeedbackBox({
  articleInfo,
  updateArticleDifficultyFeedback,
}) {
  const [isHovered, setIsHovered] = useState("");
  const { bouncingKey, trigger } = useTapBounce();

  const selectedValue = articleInfo.relative_difficulty;

  return (
    <s.InvisibleBox>
      <h4>How difficult was the text?</h4>
      <s.CenteredContent>
        {FEEDBACK_OPTIONS.map(({ key, label, value, color, emoji }) => {
          const isSelected = selectedValue === value;
          const isActiveHover = isHovered === key && !isSelected;

          const classNames = [];
          if (isSelected) classNames.push("selected");
          else if (isActiveHover) classNames.push("hovered");
          if (bouncingKey === key) classNames.push("tap-bouncing");

          const handleClick = () => {
            trigger(key);
            updateArticleDifficultyFeedback(value);
          };

          return (
            <SemanticButton
              key={key}
              $color={color}
              className={classNames.join(" ")}
              onClick={handleClick}
              onMouseEnter={() => setIsHovered(key)}
              onMouseLeave={() => setIsHovered("")}
            >
              <Emoji>{emoji}</Emoji>
              <br />
              {label}
            </SemanticButton>
          );
        })}
      </s.CenteredContent>
    </s.InvisibleBox>
  );
}
