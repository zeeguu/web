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
      icon: <MoreVertIcon fontSize="medium" />,
      iconType: "Menu",
      actionText: '"Add to Home Screen" (or "Install App")',
    },
    ios: {
      icon: <IosShareIcon fontSize="medium" />,
      iconType: "Share",
      actionText: '"Add to Home Screen"',
    },
  };

  const { icon, iconType, actionText } = instructions[selectedPlatform] || {};

  return (
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
              <b>
                Tap the {iconType} icon&nbsp;({icon})
              </b>
              &nbsp; while viewing this page on your mobile device
            </li>
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
  );
}
