import { useState } from "react";
import RadioGroup from "../components/MainNav/RadioGroup";
import AndroidIcon from "@mui/icons-material/Android";
import AppleIcon from "@mui/icons-material/Apple";
import IosShareIcon from "@mui/icons-material/IosShare";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import * as s from "./LandingPage.sc.js";

export default function InstallationInstructions() {
  const [selectedPlatform, setSelectedPlatform] = useState("android");

  const mobilePlatforms = [
    {
      id: "android",
      code: "android",
      platform: "Android",
      icon: <AndroidIcon fontSize="medium" color="black" />,
    },
    {
      id: "ios",
      code: "ios",
      platform: "iOS",
      icon: <AppleIcon fontSize="medium" color="black" />,
    },
  ];

  const instructions = {
    android: {
      browser: "Chrome",
      icon: <MoreVertIcon fontSize="medium" />,
      actionText: '"Add to Home Screen" (or "Install App")',
    },
    ios: {
      browser: "Safari or Chrome",
      icon: <IosShareIcon fontSize="medium" />,
      actionText: '"Add to Home Screen"',
    },
  };

  const { browser, icon, actionText } = instructions[selectedPlatform] || {};
  return (
    <s.PageSectionWrapper>
      <s.PageSection>
        <s.ResponsiveRow>
          <s.ContentText>
            <h2 className="left-aligned">Use Zeeguu like an&nbsp;App</h2>

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

            {selectedPlatform && (
              <ol>
                <li>
                  Open <span className="strong">zeeguu.org</span> in your mobile browser (use {browser})
                </li>
                <li>Tap the Menu icon&nbsp;{icon}</li>
                <li>
                  Select <span className="strong">{actionText}</span>
                </li>
                <li>
                  Confirm by tapping <span className="strong">"Add"</span>
                </li>
              </ol>
            )}

            <p>Zeeguu will now appear on your home screen, just like a&nbsp;regular&nbsp;app!</p>
          </s.ContentText>
          <s.ContentImage className="square" alt="" src="static/images/zeeguu-app.png" />
        </s.ResponsiveRow>
      </s.PageSection>
    </s.PageSectionWrapper>
  );
}
