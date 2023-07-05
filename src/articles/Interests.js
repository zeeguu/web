import * as s from "./Interests.sc";
import * as b from "../components/allButtons.sc";
import React, { useCallback, useState } from "react";
import Filters from "../utils/filters/filters";
import { interestsData } from "../pages/settings/content/Content";

export default function InterestsAndSearch({ setArticles }) {
  const [interests, setInterests] = useState(interestsData);

  const handleInterestPress = useCallback(
    (interestName) => {
      const newInterests = interests.map((interest) => {
        const newInterest = { name: interestName, value: interest.value };

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
      <img
        src="/static/icons/topic-arrow.svg"
        alt="topic-arrow"
        style={{
          userSelect: "none",
          position: "absolute",
          left: 0,
          top: "15px",
          transform: "rotate(180deg)",
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
        }}
      />
      <s.ScrollContainer>
        {interests.map((item, id) => (
          <b.OrangeRoundButton
            key={id}
            className={
              item?.value ? "filled-interest-btn" : "unfilled-interest-btn"
            }
            onClick={() => handleInterestPress(item.name)}
          >
            {item?.name}
          </b.OrangeRoundButton>
        ))}
      </s.ScrollContainer>
    </s.Interests>
  );
}
