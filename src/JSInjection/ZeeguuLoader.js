import { StyledLoader } from "./ZeeguuLoader.styles";

export default function ZeeguuLoader() {
  return (
    <StyledLoader>
      <div class="wrapper">
        <div className="loader"></div>
        <img
          className="logo"
          src={chrome.runtime.getURL("images/zeeguuLogo.svg")}
        />
      </div>
    </StyledLoader>
  );
}
