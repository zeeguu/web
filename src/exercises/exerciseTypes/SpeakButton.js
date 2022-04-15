import { useState, useEffect } from "react";
import strings from "../../i18n/definitions";
import ZeeguuSpeech from "../../speech/ZeeguuSpeech";
import Loader from "react-loader-spinner";
import * as s from "./Exercise.sc";

export default function SpeakButton({ bookmarkToStudy, api, styling }) {
  const initialAnimationStyle = {
    paddingLeft: "0.8125em",
    paddingRight: "0.8125em",
    marginTop: "-0.25em",
    marginBottom: "-0.25em",
  };
  const initialIconStyle = {
    paddingLeft: "0.5em",
    paddingRight: "0.5em",
    marginTop: "-0.25em",
    marginBottom: "-0.25em",
  };

  const [speech] = useState(new ZeeguuSpeech(api, bookmarkToStudy.from_lang));
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [animationStyle, setAnimationStyle] = useState(initialAnimationStyle);
  const [iconStyle, setIconStyle] = useState(initialIconStyle);
  const [animationWidth, setAnimationWidth] = useState(0);
  const [animationHeight, setAnimationHeight] = useState(0);
  const [iconWidth, setIconWidth] = useState(0);
  const [buttonLeftMargin, setButtonLeftMargin] = useState("2em");

  useEffect(() => {
    if (styling === "small") {
      let animation = {
        paddingLeft: "0.125em",
        paddingRight: "0.125em",
        marginTop: "0",
        marginBottom: "0",
      };
      let icon = {
        paddingLeft: "0",
        paddingRight: "0",
        marginTop: "0",
        marginBottom: "0",
      };
      setAnimationHeight(20);
      setAnimationWidth(15);
      setIconWidth(20);
      setAnimationStyle(animation);
      setIconStyle(icon);
    } else {
      setAnimationHeight(36);
      setAnimationWidth(25);
      setIconWidth(36);
      setAnimationStyle(initialAnimationStyle);
      setIconStyle(initialIconStyle);
    }
    if (styling === "next") {
      setButtonLeftMargin("0");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleSpeak() {
    setIsSpeaking(true);
    await speech.speakOut(bookmarkToStudy.from);
    setIsSpeaking(false);
  }

  return (
    <>
      {isSpeaking && (
        <s.FeedbackButton
          disabled={true}
          style={{ marginLeft: buttonLeftMargin }}
        >
          <Loader
            type="Bars"
            color="#ffffff"
            width={animationWidth}
            height={animationHeight}
            style={{
              paddingLeft: animationStyle.paddingLeft,
              paddingRight: animationStyle.paddingRight,
              marginTop: animationStyle.marginTop,
              marginBottom: animationStyle.marginBottom,
              display: "flex",
              justifyContent: "center",
            }}
          />
        </s.FeedbackButton>
      )}
      {!isSpeaking && (
        <s.FeedbackButton
          onClick={(e) => handleSpeak()}
          style={{ marginLeft: buttonLeftMargin }}
        >
          <img
            src="https://zeeguu.org/static/images/volume_up.svg"
            alt={strings.speak}
            width={iconWidth}
            style={{
              paddingLeft: iconStyle.paddingLeft,
              paddingRight: iconStyle.paddingRight,
              marginTop: iconStyle.marginTop,
              marginBottom: iconStyle.marginBottom,
            }}
          />
        </s.FeedbackButton>
      )}
    </>
  );
}
