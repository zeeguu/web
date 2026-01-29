import { useState } from "react";
import RadioGroup from "../components/MainNav/RadioGroup";
import AndroidIcon from "@mui/icons-material/Android";
import AppleIcon from "@mui/icons-material/Apple";
import * as s from "./LandingPage.sc.js";

export default function InstallationInstructions() {
  const [selectedPlatform, setSelectedPlatform] = useState("ios");

  const mobilePlatforms = [
    {
      id: "ios",
      code: "ios",
      platform: "iOS",
      icon: <AppleIcon fontSize="medium" color="black" />,
    },
    {
      id: "android",
      code: "android",
      platform: "Android",
      icon: <AndroidIcon fontSize="medium" color="black" />,
    },
  ];

  return (
    <s.ResponsiveRow>
      <s.ContentText>
        <h2 className="left-aligned">Get the Zeeguu App</h2>

        <RadioGroup
          ariaLabel="Select your platform:"
          name="mobile-platform"
          options={mobilePlatforms}
          selectedValue={selectedPlatform}
          onChange={(e) => {
            setSelectedPlatform(e.target.value);
          }}
          optionLabel={(e) => e.platform}
          optionValue={(e) => e.code}
          optionId={(e) => e.id}
          dynamicIcon={(e) => e.icon}
        />

        {selectedPlatform === "ios" && (
          <>
            <p>
              Download{" "}
              <a
                href="https://apps.apple.com/dk/app/zeeguu-news-for-learners/id6756917355"
                target="_blank"
                rel="noopener noreferrer"
                className="strong"
              >
                Zeeguu: News for learners
              </a>{" "}
              from the App Store
            </p>
          </>
        )}

        {selectedPlatform === "android" && (
          <>
            <p>
              The Android app is currently in beta testing. To&nbsp;get&nbsp;it:
            </p>
            <ol>
              <li>
                Join the{" "}
                <a
                  href="https://groups.google.com/g/zeeguu-beta-android"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="strong"
                >
                  Zeeguu Beta Android Google Group
                </a>
              </li>
              <li>
                Follow the link in the welcome message to&nbsp;get&nbsp;the&nbsp;app
              </li>
            </ol>
          </>
        )}
      </s.ContentText>
      <s.ContentImage className="square" alt="" src="static/images/zeeguu-app.png" />
    </s.ResponsiveRow>
  );
}
