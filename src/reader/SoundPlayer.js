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
          let player = new Audio();
          player.autoplay = true;

          // onClick of first interaction on page before I need the sounds
          // (This is a tiny MP3 file that is silent and extremely short - retrieved from https://bigsoundbank.com and then modified)
          player.src =
            "data:audio/mpeg;base64,SUQzBAAAAAABEVRYWFgAAAAtAAADY29tbWVudABCaWdTb3VuZEJhbmsuY29tIC8gTGFTb25vdGhlcXVlLm9yZwBURU5DAAAAHQAAA1N3aXRjaCBQbHVzIMKpIE5DSCBTb2Z0d2FyZQBUSVQyAAAABgAAAzIyMzUAVFNTRQAAAA8AAANMYXZmNTcuODMuMTAwAAAAAAAAAAAAAAD/80DEAAAAA0gAAAAATEFNRTMuMTAwVVVVVVVVVVVVVUxBTUUzLjEwMFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVf/zQsRbAAADSAAAAABVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVf/zQMSkAAADSAAAAABVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV";

          api.getLinkToFullArticleReadout(
            interactiveText.articleInfo,
            interactiveText.articleInfo.id,
            (linkToMp3) => {
              player.src = linkToMp3;
              player.autoplay = true;
              setMp3Player(player);
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
          console.dir(mp3Player);
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
          console.dir(mp3Player);
          mp3Player.play();
        }}
      >
        Resume
      </button>
    );
  }
}
