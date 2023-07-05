import * as s from "./Interests.sc";
import * as b from "../components/allButtons.sc";
import React, { useCallback, useEffect, useRef, useState } from "react";
import Filters from "../utils/filters/filters";
import { interestsData } from "../pages/settings/content/Content";

const interestsWithAll = [
  {
    name: "All",
    value: false,
    id: "All",
  },
  ...interestsData,
];

export default function InterestsAndSearch({ setArticles }) {
  const anchorLeft = useRef();
  const anchorRight = useRef();

  const [isVisibleLeft, setIsVisibleLeft] = useState(false);
  const [isVisibleRight, setIsVisibleRight] = useState(true);
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

  const leftCallbackFunction = useCallback((entries) => {
    const [entry] = entries;

    setIsVisibleLeft(!entry.isIntersecting);
  }, []);

  const rightCallbackFunction = useCallback((entries) => {
    const [entry] = entries;

    setIsVisibleRight(!entry.isIntersecting);
  }, []);

  useEffect(() => {
    const observerLeft = new IntersectionObserver(leftCallbackFunction, {
      root: null,
      threshold: 1,
    });
    const observerRight = new IntersectionObserver(rightCallbackFunction, {
      root: null,
      threshold: 1,
    });

    if (anchorLeft.current) {
      observerLeft.observe(anchorLeft.current);
    }

    if (anchorRight.current) {
      observerRight.observe(anchorRight.current);
    }

    return () => {
      if (anchorLeft.current) {
        observerLeft.unobserve(anchorLeft.current);
      }
      if (anchorRight.current) {
        observerRight.unobserve(anchorRight.current);
      }
    };
  }, []);

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
      />
      <s.ScrollContainer>
        <span ref={anchorLeft} />
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
        <span ref={anchorRight} />
      </s.ScrollContainer>
    </s.Interests>
  );
}
