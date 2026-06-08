import { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import useQuery from "../hooks/useQuery";
import LoadingAnimation from "../components/LoadingAnimation";

export default function SharedVideoHandler() {
  const history = useHistory();
  const query = useQuery();
  const videoId = query.get("video_id");

  const [status, setStatus] = useState("loading");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (!videoId) {
      setStatus("error");
      setErrorMessage("No video id provided.");
      return;
    }
    // No upfront getVideoInfo -- VideoPlayer on /watch/video?id= already
    // fetches it, and the response is ~1 MB for captioned videos (tokenized
    // captions per segment). Doing it twice cost ~4 seconds. We hold the
    // "Preparing your video..." screen for a beat so the transition isn't a
    // jarring flash, then hand off to VideoPlayer which has its own loading
    // state and surfaces any 404 there.
    const timer = setTimeout(
      () => history.replace(`/watch/video?id=${videoId}`),
      800,
    );
    return () => clearTimeout(timer);
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

  return (
    <LoadingAnimation
      reportIssueDelay={30000}
      specificStyle={{ minHeight: "70vh", justifyContent: "center" }}
    >
      <div style={{ textAlign: "center", marginTop: "1em" }}>
        Preparing your video…
      </div>
    </LoadingAnimation>
  );
}
