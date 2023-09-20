import * as s from "./Interests.sc";
import * as b from "../components/allButtons.sc";
import React, { useRef, useEffect, useState } from "react";
import { interestsData } from "../pages/settings/content/Content";

import ScrollContainer from "react-indiana-drag-scroll";

const interestsWithAll = [
  {
    title: "All",
    id: 100,
  },
  ...interestsData,
];

export default function InterestsAndSearch({
  setArticles,
  initialArticleList,
}) {
  const interests = interestsWithAll;
  const [selectedInterests, setSelectedInterests] = useState([]);

  useEffect(() => {
    if (!selectedInterests[0]) {
      console.log(initialArticleList.current);
      setArticles(initialArticleList.current);
      return;
    }

    const filteredArticels = initialArticleList?.current?.filter((article) => {
      const topicsString = article.topics;
      const topicsArr = topicsString
        ?.split(" ")
        .filter((topic) => topic !== "");

      console.log(topicsArr);

      const matches = topicsArr.filter((topic) =>
        selectedInterests.includes(topic)
      )[0];

      return matches;
    });

    setArticles(filteredArticels);
  }, [selectedInterests, initialArticleList.current]);

  const handleInterestPress = (interestName) => {
    const isAlreadySelected = selectedInterests.includes(interestName);

    if (interestName === "All" && isAlreadySelected) {
      setSelectedInterests([]);
    } else if (isAlreadySelected) {
      setSelectedInterests((prev) =>
        prev.filter((topic) => topic !== interestName)
      );
    } else if (interestName === "All") {
      const allInterests = [...interests].map((interest) => interest.title);
      setSelectedInterests(allInterests);
    } else {
      setSelectedInterests((prev) => [...prev, interestName]);
    }
  };

  return (
    <s.Interests>
      <ScrollContainer style={{ display: "flex", flexWrap: "nowrap" }}>
        {/* <span ref={anchorLeft} /> */}
        {interests.map(({ id, title }) => (
          <b.OrangeRoundButton
            key={id}
            className={
              selectedInterests.includes(title)
                ? "filled-interest-btn"
                : "unfilled-interest-btn"
            }
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
