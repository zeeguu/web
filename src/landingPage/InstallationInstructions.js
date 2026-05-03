import AndroidIcon from "@mui/icons-material/Android";
import AppleIcon from "@mui/icons-material/Apple";
import Button from "../pages/_pages_shared/Button.sc";
import * as s from "./LandingPage.sc.js";

export default function InstallationInstructions() {
  return (
    <s.ResponsiveRow>
      <s.ContentText>
        <h2 className="left-aligned">Get the Zeeguu&nbsp;App</h2>
        <p>Tap the button for your platform to download:</p>
        <s.AppStoreButtonRow>
          <Button
            as="a"
            href="https://apps.apple.com/dk/app/zeeguu-news-for-learners/id6756917355"
            target="_blank"
            rel="noopener noreferrer"
          >
            <AppleIcon />
            iOS
          </Button>
          <Button
            as="a"
            href="https://play.google.com/store/apps/details?id=org.zeeguu.app"
            target="_blank"
            rel="noopener noreferrer"
          >
            <AndroidIcon />
            Android
          </Button>
        </s.AppStoreButtonRow>
      </s.ContentText>
      <s.ContentImage className="square" alt="" src="static/images/zeeguu-app.png" />
    </s.ResponsiveRow>
  );
}
