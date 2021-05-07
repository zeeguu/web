import { useState } from "react";
import strings from "../../i18n/definitions";
import ZeeguuSpeech from "../../speech/ZeeguuSpeech";
import Loader from "react-loader-spinner";
import { usePromiseTracker } from "react-promise-tracker";

export default function BottomFeedback({
  bookmarkToStudy,
  correctAnswer,
  api,
}) {
  const [speech] = useState(new ZeeguuSpeech(api, bookmarkToStudy.from_lang));
  const { promiseInProgress } = usePromiseTracker();

  function handleSpeak() {
    speech.speakOut(bookmarkToStudy.from);
  }

  return (
    <div className="bottomInput">
      {promiseInProgress && (
        <button disabled={true} onClick={(e) => handleSpeak()}>
          <Loader type="Bars" color="#000000" height={16} width={51} />
        </button>
      )}
      {!promiseInProgress && (
        <button onClick={(e) => handleSpeak()}>{strings.speak}</button>
      )}

      <button onClick={(e) => correctAnswer()} autoFocus>
        {strings.next}
      </button>
    </div>
  );
}
