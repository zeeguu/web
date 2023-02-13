import React, { useCallback, useState } from "react";
import strings from "../../../i18n/definitions";
import * as scs from "../Settings.sc";
import * as sc from "../../../components/Theme.sc";
import * as s from "./Content.sc";
import {
  InterestButton,
  variants,
} from "../../../components/interestButton/InterestButton";

export const interestsData = [
  {
    name: "Art",
    value: false,
    id: "intArt",
  },
  {
    name: "Business",
    value: false,
    id: "intBusiness",
  },
  {
    name: "Culture",
    value: false,
    id: "intCulture",
  },
  {
    name: "Food",
    value: false,
    id: "intFood",
  },
  {
    name: "Health",
    value: false,
    id: "intHealth",
  },
  {
    name: "Music",
    value: false,
    id: "intMusic",
  },
  {
    name: "Politics",
    value: false,
    id: "intPolitics",
  },
  {
    name: "Satire",
    value: false,
    id: "intSatire",
  },
  {
    name: "Social",
    value: false,
    id: "intSocial",
  },
  {
    name: "Science",
    value: false,
    id: "intScience",
  },
  {
    name: "Social Sciences",
    value: false,
    id: "intSocialSciences",
  },
  {
    name: "Sport",
    value: false,
    id: "intSport",
  },
  {
    name: "Travel",
    value: false,
    id: "intTravel",
  },
  {
    name: "Technology",
    value: false,
    id: "intTechnology",
  },
];
export const nonInterestsData = [
  {
    name: "Art",
    value: false,
    id: "nonArt",
  },
  {
    name: "Business",
    value: false,
    id: "nonBusiness",
  },
  {
    name: "Culture",
    value: false,
    id: "nonCulture",
  },
  {
    name: "Food",
    value: false,
    id: "nonFood",
  },
  {
    name: "Health",
    value: false,
    id: "nonHealth",
  },
  {
    name: "Music",
    value: false,
    id: "nonMusic",
  },
  {
    name: "Politics",
    value: false,
    id: "nonPolitics",
  },
  {
    name: "Satire",
    value: false,
    id: "nonSatire",
  },
  {
    name: "Social",
    value: false,
    id: "nonSocial",
  },
  {
    name: "Science",
    value: false,
    id: "nonScience",
  },
  {
    name: "Social Sciences",
    value: false,
    id: "nonSocialSciences",
  },
  {
    name: "Sport",
    value: false,
    id: "nonSport",
  },
  {
    name: "Travel",
    value: false,
    id: "nonTravel",
  },
  {
    name: "Technology",
    value: false,
    id: "nonTechnology",
  },
];

export const Content = () => {
  const [interests, setInterests] = useState(interestsData);
  const [nonInterests, setNonInterests] = useState(nonInterestsData);

  const handleInterestPress = useCallback(
    (type) => {
      return (interestName) => {
        const newInterests = (
          type === "nonInterests" ? nonInterests : interests
        ).map((interest) => {
          const newInterest = { name: interestName, value: interest.value };

          if (interest.name === interestName) {
            newInterest.value = !interest.value;
            return newInterest;
          }

          return interest;
        });
        if (type === "nonInterests") setNonInterests(newInterests);
        if (type === "interests") setInterests(newInterests);
      };
    },
    [interests, nonInterests]
  );

  const handleSelectAllInterests = useCallback(
    (type) => {
      return () => {
        const newInterests = (
          type === "nonInterests" ? nonInterests : interests
        ).map((interest) => ({ ...interest, value: true }));

        if (type === "nonInterests") setNonInterests(newInterests);
        if (type === "interests") setInterests(newInterests);
      };
    },
    [interests, nonInterests]
  );

  return (
    <div>
      <sc.H3>{strings.interests}</sc.H3>
      <div>
        <s.InterestsBox>
          <InterestButton
            variant={variants.grayOutlined}
            title={strings.all}
            onClick={handleSelectAllInterests("interests")}
          />
          <InterestButton
            variant={variants.orangeOutlined}
            icon={
              <img
                src="/static/icons/plus.svg"
                alt="plus"
                style={{ width: "10px", height: "10px", marginRight: "7px" }}
              />
            }
            title={strings.yourOwnInterest}
          />
        </s.InterestsBox>
        <s.InterestsContainer>
          {interests.map((item, id) => (
            <InterestButton
              key={id}
              variant={
                item.value ? variants.orangeFilled : variants.grayOutlined
              }
              title={item.name}
              onClick={handleInterestPress("interests")}
            />
          ))}
        </s.InterestsContainer>
      </div>

      <sc.H3>{strings.nonInterests}</sc.H3>
      <div>
        <s.InterestsBox>
          <InterestButton
            variant={variants.grayOutlined}
            title={strings.all}
            onClick={handleSelectAllInterests("nonInterests")}
          />
          <InterestButton
            variant={variants.orangeOutlined}
            icon={
              <img
                src="/static/icons/plus.svg"
                alt="plus"
                style={{ width: "10px", height: "10px", marginRight: "7px" }}
              />
            }
            title={strings.yourOwnInterest}
          />
        </s.InterestsBox>
        <s.InterestsContainer>
          {nonInterests.map((item, id) => (
            <InterestButton
              key={id}
              variant={item.value ? variants.grayFilled : variants.grayOutlined}
              title={item.name}
              onClick={handleInterestPress("nonInterests")}
            />
          ))}
        </s.InterestsContainer>
      </div>
      <scs.SettingButton onClick={() => {}}>{strings.save}</scs.SettingButton>
    </div>
  );
};
