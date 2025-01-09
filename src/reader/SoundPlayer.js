import { useEffect, useState, useRef } from "react";

// (This is a tiny MP3 file that is silent and extremely short - retrieved from https://bigsoundbank.com and then modified)
const EMPTY_SOUND_DATA =
  "data:audio/mpeg;base64,SUQzBAAAAAABEVRYWFgAAAAtAAADY29tbWVudABCaWdTb3VuZEJhbmsuY29tIC8gTGFTb25vdGhlcXVlLm9yZwBURU5DAAAAHQAAA1N3aXRjaCBQbHVzIMKpIE5DSCBTb2Z0d2FyZQBUSVQyAAAABgAAAzIyMzUAVFNTRQAAAA8AAANMYXZmNTcuODMuMTAwAAAAAAAAAAAAAAD/80DEAAAAA0gAAAAATEFNRTMuMTAwVVVVVVVVVVVVVUxBTUUzLjEwMFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVf/zQsRbAAADSAAAAABVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVf/zQMSkAAADSAAAAABVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV";

const UNKNOWN = "-:--";

export default function SoundPlayer({ api, interactiveText }) {
  const [state, setState] = useState("initial");
  const [mp3Player, setMp3Player] = useState();
  const intervalRef = useRef();
  const [totalTime, setTotalTime] = useState(UNKNOWN);
  const [currentTime, setCurrentTime] = useState("0:00" + "/" + totalTime);
  const [counter, setCounter] = useState(0);

  function onDestroy() {
    if (mp3Player) {
      mp3Player.pause();
    }
  }

  function onCreate() {}

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      if (!mp3Player || !mp3Player.currentTime || !mp3Player.duration) {
        setCounter(counter + 1);
        return;
      }

      if (totalTime == UNKNOWN) {
        setTotalTime(formatMMSS(mp3Player.duration));
      }

      setCurrentTime(formatMMSS(mp3Player.currentTime) + " / " + totalTime);
    }, 1000);
    return () => clearInterval(intervalRef.current);
  }, [currentTime, counter]);

  useEffect(() => {
    onCreate();
    return () => {
      onDestroy();
    };
  }, [mp3Player]);

  function startPlaying() {
    // onClick of first interaction on page before I need the sounds
    let player = playSilentAudio();

    api.getLinkToFullArticleReadout(
      interactiveText.articleInfo_id,
      (linkToMp3) => {
        player.src = linkToMp3;
        setMp3Player(player);

        setState("playing");
      },
    );
  }

  function pausePlay() {
    setState("paused");
    mp3Player.pause();
  }

  function resumePlay() {
    setState("playing");
    mp3Player.play();
  }

  if (state === "initial") {
    return (
      <div>
        <button onClick={startPlaying}>
          <img
            width="35px"
            src="/static/images/play-button.svg"
            alt="start playing"
          />
        </button>
        <div className="buttonText">Read aloud</div>
      </div>
    );
  } else if (state === "playing") {
    return (
      <div>
        <button onClick={pausePlay}>
          <img
            width="35px"
            src="/static/images/pause-button.svg"
            alt="pause play"
          />
        </button>
        <div className="buttonText">{currentTime}</div>
      </div>
    );
  } else if (state === "paused") {
    return (
      <div>
        <button onClick={resumePlay}>
          <img
            width="35px"
            src="/static/images/play-button.svg"
            alt="resume play"
          />
        </button>
        <div className="buttonText">{currentTime}</div>
      </div>
    );
  }
}

function playSilentAudio() {
  let player = new Audio();
  player.autoplay = true;
  player.src = EMPTY_SOUND_DATA;
  return player;
}

function formatMMSS(seconds) {
  let minutes = Math.floor(seconds / 60);
  let remainingSeconds = Math.floor(seconds - minutes * 60);
  return minutes + ":" + (remainingSeconds < 10 ? "0" : "") + remainingSeconds;
}
