import { useState, useEffect } from "react";
import strings from "../../i18n/definitions";
import ZeeguuSpeech from "../../speech/ZeeguuSpeech";
import Loader from "react-loader-spinner";
import * as s from "./SpeakButton.sc";

export default function SpeakButton({ bookmarkToStudy, api, styling }) {
  const initialAnimationStyle = {
    paddingLeft: "0.8125em",
    paddingRight: "0.8125em",
    marginTop: "-0.25em",
    marginBottom: "-0.25em",
  };

  const [speech] = useState(new ZeeguuSpeech(api, bookmarkToStudy.from_lang));
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [animationStyle, setAnimationStyle] = useState(initialAnimationStyle);
  const [animationWidth, setAnimationWidth] = useState(0);
  const [animationHeight, setAnimationHeight] = useState(0);
  const [iconWidth, setIconWidth] = useState(0);
  const [iconHeight, setIconHeight] = useState(0);
  const [buttonLeftMargin, setButtonLeftMargin] = useState("2em");

  useEffect(() => {
    if (styling === "small") {
      let animation = {
        paddingLeft: "0.125em",
        paddingRight: "0.125em",
        marginTop: "0",
        marginBottom: "0",
      };

      setAnimationHeight(20);
      setAnimationWidth(15);
      setIconWidth(20);
      setAnimationStyle(animation);
    } else {
      setAnimationHeight(36);
      setAnimationWidth(25);
      setIconWidth(36);
      setAnimationStyle(initialAnimationStyle);
    }

    if (styling === "large") {
      setIconWidth(75);
      setIconHeight(75);
      setAnimationWidth(64);
      setAnimationHeight(75);
      setButtonLeftMargin("0em");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleSpeak() {
    setIsSpeaking(true);
    await speech.speakOut(bookmarkToStudy.from);
    setIsSpeaking(false);
  }

  return (
    <s.SpeakButton
      disabled={isSpeaking}
      onClick={(e) => !isSpeaking && handleSpeak()}
      style={{ marginLeft: buttonLeftMargin }}
    >
      {isSpeaking && (
        <Loader
          type="Bars"
          color="#ffffff"
          width={animationWidth}
          height={animationHeight}
          className={styling}
          style={{
            paddingLeft: animationStyle.paddingLeft,
            paddingRight: animationStyle.paddingRight,
            marginTop: animationStyle.marginTop,
            marginBottom: animationStyle.marginBottom,
            display: "flex",
            justifyContent: "center",
          }}
        />
      )}

      {!isSpeaking && (
        <s.SpeakerImage className={styling}>
          <img
            src="/static/images/volume_up.svg"
            alt={strings.speak}
            width={iconWidth}
          />
        </s.SpeakerImage>
      )}
    </s.SpeakButton>
  );
}
