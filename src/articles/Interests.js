import * as s from "./Interests.sc";
import * as b from "../components/allButtons.sc";
import React, { useCallback, useEffect, useRef, useState } from "react";
import Filters from "../utils/filters/filters";
import { interestsData } from "../pages/settings/content/Content";

import ScrollContainer from "react-indiana-drag-scroll";

const interestsWithAll = [
  {
    title: "All",
    id: 100,
  },
  ...interestsData,
];

export default function InterestsAndSearch({ setArticles }) {
  const [interests, setInterests] = useState(interestsWithAll);

  const handleInterestPress = useCallback(
    (interestName) => {
      const isAllPressed =
        interestName === "All" ? interests[0].value : undefined;

      const newInterests = interests.map((interest) => {
        const newInterest = { name: interest.name, value: interest.value };

        if (isAllPressed !== undefined) {
          newInterest.value = !isAllPressed;
          return newInterest;
        }

        if (interest.name === interestName) {
          newInterest.value = !interest.value;
          return newInterest;
        }

        return interest;
      });

      setInterests(newInterests);

      setArticles(
        Filters.getByInterests(
          newInterests.filter((interest) => interest?.value)
        )
      );
    },
    [interests]
  );

  return (
    <s.Interests>
      {/* <img
        src="/static/icons/topic-arrow.svg"
        alt="topic-arrow"
        style={{
          userSelect: "none",
          position: "absolute",
          left: 0,
          top: "15px",
          transform: "rotate(180deg)",
          display: isVisibleLeft ? "block" : "none",
        }}
      />
      <img
        src="/static/icons/topic-arrow.svg"
        alt="topic-arrow"
        style={{
          userSelect: "none",
          position: "absolute",
          right: 0,
          top: "15px",
          display: isVisibleRight ? "block" : "none",
        }}
      /> */}
      <ScrollContainer style={{ display: "flex", flexWrap: "nowrap" }}>
        {/* <span ref={anchorLeft} /> */}
        {interests.map(({ id, title }) => (
          <b.OrangeRoundButton
            key={id}
            className={!title ? "filled-interest-btn" : "unfilled-interest-btn"} //TODO: Figure out how to change bg here
            onClick={() => handleInterestPress(title)}
          >
            {title}
          </b.OrangeRoundButton>
        ))}
        {/* <span ref={anchorRight} /> */}
      </ScrollContainer>
    </s.Interests>
  );
}
