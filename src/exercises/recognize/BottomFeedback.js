import { useState } from "react";
import strings from "../../i18n/definitions";
import ZeeguuSpeech from "../../speech/ZeeguuSpeech";

export default function BottomFeedback({
  bookmarkToStudy,
  correctAnswer,
  api,
}) {
  const [speech] = useState(new ZeeguuSpeech(api, bookmarkToStudy.from_lang));

  function handleSpeak() {
    speech.speakOut(bookmarkToStudy.from);
  }

  return (
    <div className="bottomInput">
      <button onClick={(e) => handleSpeak()}>{strings.speak}</button>

      <button onClick={(e) => correctAnswer()} autoFocus>
        {strings.next}
      </button>
    </div>
  );
}
