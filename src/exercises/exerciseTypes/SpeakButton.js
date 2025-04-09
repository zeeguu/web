import { useContext, useEffect, useState } from "react";
import strings from "../../i18n/definitions";

import Loader from "react-loader-spinner";
import * as s from "./SpeakButton.sc";

import { getStaticPath } from "../../utils/misc/staticPath.js";

import { SpeechContext } from "../../contexts/SpeechContext";

const small_style = {
  // Icon properties
  img_height: 15,
  img_width: 30,
  // Loader properties
  loader_width: 30,
  loader_height: 15,
};

const small_next_style = {
  // Icon properties
  img_height: 30,
  img_width: 60,
  // Loader properties
  loader_width: 60,
  loader_height: 30,
};

const large_style = {
  // Icon properties
  img_height: 60,
  img_width: 120,
  // Loader properties
  loader_width: 120,
  loader_height: 60,
};

const selected_style = {
  // Icon properties
  img_height: 50,
  img_width: 100,
  // Loader properties
  loader_width: 100,
  loader_height: 50,
};

const square_style = {
  // Icon properties
  img_height: 25,
  img_width: 25,
  // Loader properties
  loader_width: 25,
  loader_height: 25,
};

const styles = {
  small: small_style,
  next: small_next_style,
  large: large_style,
  selected: selected_style,
  square: square_style,
};

export default function SpeakButton({
  bookmarkToStudy,
  styling,
  isSelected,
  isReadContext,
  parentIsSpeakingControl,
  onClickCallback,
}) {
  const speech = useContext(SpeechContext);
  const [isSpeaking, setIsSpeaking] = useState(false);
  let style = styles[styling] || small_next_style; // default is next style

  useEffect(() => {
    setIsSpeaking(parentIsSpeakingControl);
  }, [parentIsSpeakingControl]);

  async function handleSpeak() {
    try {
      if (isReadContext) {
        await speech.speakOut(bookmarkToStudy.context, setIsSpeaking);
      } else {
        await speech.speakOut(bookmarkToStudy.from, setIsSpeaking);
      }
    } catch (err) {
      console.log("There was an error executing the speech: " + err);
    }
  }

  return (
    <>
      <s.SpeakButton
        selected={isSelected}
        disabled={isSpeaking}
        onClick={() => {
          !isSpeaking && handleSpeak();
          onClickCallback();
        }}
      >
        {isSpeaking && (
          <Loader
            type="Bars"
            color="#ffffff"
            width={style.loader_width}
            height={style.loader_height}
            style={{
              paddingLeft: style.loader_paddingLeft,
              paddingRight: style.loader_paddingRight,
              marginTop: style.loader_marginTop,
              marginBottom: style.loader_marginBottom,
              display: "flex",
              justifyContent: "center",
            }}
          />
        )}

        {!isSpeaking && (
          <img
            src={getStaticPath("images", "volume_up.svg")}
            alt={strings.speak}
            width={style.img_width}
            height={style.img_height}
            style={{
              paddingLeft: style.img_paddingLeft,
              paddingRight: style.img_paddingRight,
            }}
          />
        )}
      </s.SpeakButton>
    </>
  );
}
