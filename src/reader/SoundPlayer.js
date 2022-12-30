import { useState } from "react";

export default function SoundPlayer({ api, interactiveText }) {
  const [state, setState] = useState("initial");
  const [mp3Player, setMp3Player] = useState();

  if (state === "initial") {
    return (
      <button
        onClick={() => {
          console.log("starting to play");
          setState("playing");
          // interactiveText.playAll();
          let mp3Player = new Audio();
          mp3Player.autoplay = true;

          // onClick of first interaction on page before I need the sounds
          // (This is a tiny MP3 file that is silent and extremely short - retrieved from https://bigsoundbank.com and then modified)
          mp3Player.src =
            "data:audio/mpeg;base64,SUQzBAAAAAABEVRYWFgAAAAtAAADY29tbWVudABCaWdTb3VuZEJhbmsuY29tIC8gTGFTb25vdGhlcXVlLm9yZwBURU5DAAAAHQAAA1N3aXRjaCBQbHVzIMKpIE5DSCBTb2Z0d2FyZQBUSVQyAAAABgAAAzIyMzUAVFNTRQAAAA8AAANMYXZmNTcuODMuMTAwAAAAAAAAAAAAAAD/80DEAAAAA0gAAAAATEFNRTMuMTAwVVVVVVVVVVVVVUxBTUUzLjEwMFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVf/zQsRbAAADSAAAAABVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVf/zQMSkAAADSAAAAABVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV";

          api.getLinkToFullArticleReadout(
            interactiveText.articleInfo,
            interactiveText.articleInfo.id,
            (linkToMp3) => {
              mp3Player.src = linkToMp3;
              mp3Player.autoplay = true;
              setMp3Player(mp3Player);
              // mp3Player.onerror = reject;
              // mp3Player.onended = resolve;
            }
          );
        }}
      >
        Play
      </button>
    );
  } else if (state === "playing") {
    return (
      <button
        onClick={() => {
          setState("paused");
          mp3Player.pause();
        }}
      >
        Pause
      </button>
    );
  } else if (state === "paused") {
    return (
      <button
        onClick={() => {
          setState("playing");
          interactiveText.resume();
        }}
      >
        Resume
      </button>
    );
  }
}
