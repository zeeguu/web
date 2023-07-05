import React from "react";
import strings from "../../../i18n/definitions";
import * as scs from "../Settings.sc";
import * as sc from "../../../components/Theme.sc";
import * as s from "./Content.sc";
import {
  InterestButton,
  variants,
} from "../../../components/interestButton/InterestButton";

export const Content = ({ userDetails, setUserDetails }) => {
  return (
    <div>
      <sc.H3>{strings.interests}</sc.H3>
      <div>
        <s.InterestsBox>
          <InterestButton variant={variants.grayOutlined} title="All" />
          <InterestButton
            variant={variants.orangeOutlined}
            icon={
              <img
                src="/static/icons/plus.svg"
                alt="plus"
                style={{ width: "10px", height: "10px", marginRight: "7px" }}
              />
            }
            title="Your own interest"
          />
        </s.InterestsBox>
        <s.InterestsContainer>
          <InterestButton variant={variants.grayOutlined} title="Art" />
          <InterestButton variant={variants.orangeFilled} title="Business" />
          <InterestButton variant={variants.grayFilled} title="Culture" />
          <InterestButton variant={variants.orangeFilled} title="Food" />
          <InterestButton variant={variants.grayFilled} title="Health" />
          <InterestButton variant={variants.grayOutlined} title="Music" />
        </s.InterestsContainer>
      </div>

      <sc.H3>{strings.nonInterests}</sc.H3>
      <div>
        <s.InterestsBox>
          <InterestButton variant={variants.grayOutlined} title="All" />
          <InterestButton
            variant={variants.orangeOutlined}
            icon={
              <img
                src="/static/icons/plus.svg"
                alt="plus"
                style={{ width: "10px", height: "10px", marginRight: "7px" }}
              />
            }
            title="Your own interest"
          />
        </s.InterestsBox>
        <s.InterestsContainer>
          <InterestButton variant={variants.grayOutlined} title="Art" />
          <InterestButton variant={variants.orangeFilled} title="Business" />
          <InterestButton variant={variants.orangeFilled} title="Culture" />
          <InterestButton variant={variants.grayFilled} title="Food" />
          <InterestButton variant={variants.grayFilled} title="Health" />
          <InterestButton variant={variants.grayFilled} title="Music" />
        </s.InterestsContainer>
      </div>
      <scs.SettingButton onClick={() => {}}>{strings.save}</scs.SettingButton>
    </div>
  );
};
