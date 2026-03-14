import { useState, useEffect, useContext } from "react";
import { useHistory } from "react-router-dom";
import { APIContext } from "../contexts/APIContext";
import useQuery from "../hooks/useQuery";
import LoadingAnimation from "../components/LoadingAnimation";

export default function SharedArticleHandler() {
  const api = useContext(APIContext);
  const history = useHistory();
  const query = useQuery();
  const sharedUrl = query.get("url");

  const [status, setStatus] = useState("loading");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (!sharedUrl) {
      setStatus("error");
      setErrorMessage("No URL provided.");
      return;
    }

    api.findOrCreateArticle(
      { url: sharedUrl },
      (result) => {
        try {
          if (typeof result === "string" && result.includes("Language not supported")) {
            setStatus("error");
            setErrorMessage("This article's language is not supported by Zeeguu.");
            return;
          }

          const artinfo = typeof result === "string" ? JSON.parse(result) : result;
          history.replace("/read/article?id=" + artinfo.id);
        } catch (e) {
          setStatus("error");
          setErrorMessage("Could not process this article.");
        }
      },
      (error) => {
        setStatus("error");
        setErrorMessage(
          "Failed to load article. It may be behind a paywall or not readable."
        );
      }
    );
  }, [sharedUrl]);

  if (status === "loading") {
    return (
      <div style={{ textAlign: "center", padding: "4em 2em" }}>
        <LoadingAnimation />
        <p>Opening article...</p>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div style={{ textAlign: "center", padding: "4em 2em" }}>
        <h2>Could not open article</h2>
        <p>{errorMessage}</p>
        <p style={{ color: "#666", fontSize: "0.9em", wordBreak: "break-all" }}>
          {sharedUrl}
        </p>
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

  return null;
}
