import { useState } from "react";

export default function SoundPlayer({ interactiveText }) {
  const [state, setState] = useState("initial");

  if (state === "initial") {
    return (
      <button
        onClick={() => {
          console.log("starting to play");
          setState("playing");
          interactiveText.playAll();
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
          interactiveText.pause();
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
