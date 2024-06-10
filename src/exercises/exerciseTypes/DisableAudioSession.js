import strings from "../../i18n/definitions";
import * as s from "./Exercise.sc";
import SessionStorage from "../../assorted/SessionStorage";
import { MINUTES_TO_RE_ENABLE_AUDIO_AFTER_DISABLE } from "../ExerciseConstants";
import { toast } from "react-toastify";

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
export default function DisableAudioSession({
  handleDisabledAudio,
  setIsCorrect,
}) {
  function disableAudio(e) {
    getTimeStamp();
    e.preventDefault();
    SessionStorage.disableAudioExercises();
    setIsCorrect(true);

    const skipOnTimeout = setTimeout(() => {
      handleDisabledAudio();
    }, [3000]);

    toast.info(
      `You won't see audio exercises for the next ${MINUTES_TO_RE_ENABLE_AUDIO_AFTER_DISABLE} minutes!`,
      {
        position: "bottom-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
        onClick: () => {
          clearTimeout(skipOnTimeout);
          handleDisabledAudio();
        },
        onClose: () => {
          clearTimeout(skipOnTimeout);
        },
      },
    );
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
