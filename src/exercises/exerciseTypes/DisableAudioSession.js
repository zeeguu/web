import strings from "../../i18n/definitions";
import * as s from "./Exercise.sc";
import SessionStorage from "../../assorted/SessionStorage";
import { MINUTES_TO_RE_ENABLE_AUDIO_AFTER_DISABLE } from "../ExerciseConstants";
import { toast } from "react-toastify";

const TOAST_CLOSE_TIMEOUT = 2000;

export default function DisableAudioSession({
  handleDisabledAudio,
  setIsCorrect,
}) {
  function disableAudio(e) {
    e.preventDefault();
    SessionStorage.disableAudioExercises();
    setIsCorrect(true);

    // Call the function on a timeout
    // To allow the Toast notification to remain and
    // time for the user to read. Toast animation
    // takes about 1 second + autoClose.
    const skipOnTimeout = setTimeout(() => {
      handleDisabledAudio();
    }, [TOAST_CLOSE_TIMEOUT + 1000]);

    toast.info(
      `You won't see audio exercises for the next ${MINUTES_TO_RE_ENABLE_AUDIO_AFTER_DISABLE} minutes!`,
      {
        position: "bottom-right",
        autoClose: TOAST_CLOSE_TIMEOUT,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
        onClick: () => {
          // If the user clicks, the notification
          // immediately handleTheDisableAudio
          // This is also triggered on clicking the close X
          clearTimeout(skipOnTimeout);
          handleDisabledAudio();
        },
        onClose: () => {
          // When the toast is removed, then we clear the timeout
          // to avoid skipping the exercise twice.
          // Happens when the user doesn't click on Toast or
          // clicks the Next button.
          clearTimeout(skipOnTimeout);
        },
      },
    );
    setTimeout(
      () => {
        SessionStorage.setAudioExercisesEnabled(true);
      },
      MINUTES_TO_RE_ENABLE_AUDIO_AFTER_DISABLE * 60 * 1000,
    );
  }

  return (
    <s.CenteredWordRow>
      <s.StyledGreyButton
        className="styledGreyButton"
        onClick={(e) => disableAudio(e)}
      >
        {strings.disableAudio}
      </s.StyledGreyButton>
    </s.CenteredWordRow>
  );
}
