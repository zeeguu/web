import { useState } from "react";
import Speech from "speak-tts";

function randomElement(x) {
  return x[Math.floor(Math.random() * x.length)];
}

export default function BottomFeedback({ bookmarkToStudy, correctAnswer }) {
  const [speech] = useState(new Speech());

  speech
    .init()
    .then((data) => {
      // The "data" object contains the list of available voices and the voice synthesis params
      let randomVoice = _getRandomVoice(data.voices, bookmarkToStudy.from_lang);

      speech.setVoice(randomVoice.name);
    })
    .catch((e) => {
      console.error("An error occured while initializing : ", e);
    });

  function handleSpeak() {
    speech.speak({ text: bookmarkToStudy.from });
  }

  return (
    <div className="bottomInput">
      <button onClick={(e) => handleSpeak()}>Speak</button>

      <button onClick={(e) => correctAnswer()} autoFocus>
        Next
      </button>
    </div>
  );
}

function _randomElement(x) {
  return x[Math.floor(Math.random() * x.length)];
}

function _getRandomVoice(voices, language) {
  let x = _randomElement(voices.filter((v) => v.lang.includes(language)));
  return x;
}
