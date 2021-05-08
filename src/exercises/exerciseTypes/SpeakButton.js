import { useState } from "react";
import strings from "../../i18n/definitions";
import ZeeguuSpeech from "../../speech/ZeeguuSpeech";
import Loader from "react-loader-spinner";
import * as s from "./Exercise.sc";

export default function SpeakButton({ bookmarkToStudy, api }) {
  const [speech] = useState(new ZeeguuSpeech(api, bookmarkToStudy.from_lang));
  const [isSpeaking, setIsSpeaking] = useState(false);

  async function handleSpeak() {
    setIsSpeaking(true);
    await speech.speakOut(bookmarkToStudy.from);
    setIsSpeaking(false);
  }

  return (
    <>
      {isSpeaking && (
        <s.FeedbackButton disabled={true}>
          <Loader type="Bars" color="#ffffff" height={20} width={51} />
        </s.FeedbackButton>
      )}
      {!isSpeaking && (
        <s.FeedbackButton onClick={(e) => handleSpeak()}>
          <img src="/static/images/sound.svg" alt={strings.speak} />
        </s.FeedbackButton>
      )}
    </>
  );
}
