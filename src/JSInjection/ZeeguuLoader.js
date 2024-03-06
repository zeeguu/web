import { StyledLoader } from "./ZeeguuLoader.styles";
import { BROWSER_API } from "../utils/browserApi";

export default function ZeeguuLoader() {
  return (
    <StyledLoader>
      <div class="wrapper">
        <div className="loader"></div>
        <img
          className="logo"
          src={BROWSER_API.runtime.getURL("images/zeeguuLogo.svg")}
          alt="Zeeguu logo"
        />
      </div>
    </StyledLoader>
  );
}
