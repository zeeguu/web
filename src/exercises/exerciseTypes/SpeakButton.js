import { useState } from "react";
import strings from "../../i18n/definitions";
import ZeeguuSpeech from "../../speech/ZeeguuSpeech";
import Loader from "react-loader-spinner";
import * as s from "./SpeakButton.sc";

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

const styles = {
  small: small_style,
  next: small_next_style,
  large: large_style,
  selected: selected_style,
};

export default function SpeakButton({
  bookmarkToStudy,
  api,
  styling,
  handleClick,
}) {
  const [speech] = useState(new ZeeguuSpeech(api, bookmarkToStudy.from_lang));
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [cls, setCls] = useState("");
  let style = styles[styling] || small_next_style; // default is next style

  async function handleSpeak() {
    setIsSpeaking(true);
    await speech.speakOut(bookmarkToStudy.from);
    setIsSpeaking(false);
  }

  return (
    <>
    {handleClick !== undefined && (
    <s.SpeakButton
      disabled={isSpeaking}
      className={cls}
      onClick={(e) => {
        !isSpeaking && handleSpeak();
        handleClick();
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
          src="/static/images/volume_up.svg"
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
    
    )}

{handleClick === undefined && (
    <s.SpeakButton
      disabled={isSpeaking}
      className={cls}
      onClick={(e) => {
        !isSpeaking && handleSpeak();
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
          src="/static/images/volume_up.svg"
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
    
    )}
    </>
  );
  
}
