import strings from "../../i18n/definitions";
import * as s from "./Exercise.sc";

export default function DisableAudioSession({disableAudio}) {
  return (
    <s.CenteredRow>
      <s.StyledGreyButton className="styledGreyButton" onClick={disableAudio}>
        {strings.disableAudio}
      </s.StyledGreyButton>
    </s.CenteredRow>
  );
}
