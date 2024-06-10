import strings from "../../i18n/definitions";
import * as s from "./Exercise.sc";
import SessionStorage from "../../assorted/SessionStorage";

const MINUTES_TO_RE_ENABLE_AUDIO_AFTER_DISABLE = 15;
function getTimeStamp() {
  var currentdate = new Date();
  var datetime =
    "Last Sync: " +
    currentdate.getDay() +
    "/" +
    currentdate.getMonth() +
    "/" +
    currentdate.getFullYear() +
    " @ " +
    currentdate.getHours() +
    ":" +
    currentdate.getMinutes() +
    ":" +
    currentdate.getSeconds();
  console.log(datetime);
}
export default function DisableAudioSession({ handleDisabledAudio }) {
  function disableAudio(e) {
    getTimeStamp();
    e.preventDefault();
    SessionStorage.disableAudioExercises();
    handleDisabledAudio();
    setTimeout(
      () => {
        SessionStorage.setAudioExercisesEnabled(true);
        console.log(
          "########################## Re-enabled AUDIO exercises ##########################",
        );
        getTimeStamp();
      },
      MINUTES_TO_RE_ENABLE_AUDIO_AFTER_DISABLE * 60 * 1000,
    );
  }

  return (
    <s.CenteredRow>
      <s.StyledGreyButton
        className="styledGreyButton"
        onClick={(e) => disableAudio(e)}
      >
        {strings.disableAudio}
      </s.StyledGreyButton>
    </s.CenteredRow>
  );
}
