import { useState, useEffect, useContext } from "react";
import { useHistory } from "react-router-dom";
import { APIContext } from "../contexts/APIContext";
import useQuery from "../hooks/useQuery";
import LoadingAnimation from "../components/LoadingAnimation";

export default function SharedVideoHandler() {
  const api = useContext(APIContext);
  const history = useHistory();
  const query = useQuery();
  const videoId = query.get("video_id");

  const [status, setStatus] = useState("loading");
  const [errorMessage, setErrorMessage] = useState("");
  const [videoTitle, setVideoTitle] = useState(null);

  useEffect(() => {
    if (!videoId) {
      setStatus("error");
      setErrorMessage("No video id provided.");
      return;
    }
    api.getVideoInfo(
      videoId,
      (video) => {
        if (!video || !video.id) {
          setStatus("error");
          setErrorMessage("Video not found.");
          return;
        }
        setVideoTitle(video.title || null);
        // Hold the "Preparing <title>..." screen long enough to actually be
        // visible -- without the delay the redirect fires on the same paint
        // frame as the title set, and the user sees nothing.
        setTimeout(() => history.replace(`/watch/video?id=${videoId}`), 800);
      },
      () => {
        setStatus("error");
        setErrorMessage("Could not load the shared video.");
      },
    );
  }, [videoId]);

  if (status === "error") {
    return (
      <div style={{ textAlign: "center", padding: "4em 2em" }}>
        <h2>Could not open video</h2>
        <p>{errorMessage}</p>
        {videoId && (
          <p style={{ color: "#666", fontSize: "0.9em" }}>video #{videoId}</p>
        )}
        <button
          onClick={() => history.push("/articles")}
          style={{
            marginTop: "1em",
            padding: "0.5em 1.5em",
            fontSize: "1em",
            cursor: "pointer",
          }}
        >
          Go to Articles
        </button>
      </div>
    );
  }

  const message = videoTitle
    ? `Preparing "${videoTitle}"…`
    : "Preparing your video…";

  return (
    <LoadingAnimation
      reportIssueDelay={30000}
      specificStyle={{ minHeight: "70vh", justifyContent: "center" }}
    >
      <div style={{ textAlign: "center", marginTop: "1em" }}>{message}</div>
    </LoadingAnimation>
  );
}
