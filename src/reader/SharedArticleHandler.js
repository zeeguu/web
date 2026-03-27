import { useState, useEffect, useContext } from "react";
import { useHistory } from "react-router-dom";
import { APIContext } from "../contexts/APIContext";
import { UserContext } from "../contexts/UserContext";
import useQuery from "../hooks/useQuery";
import LoadingAnimation from "../components/LoadingAnimation";
import ArticleLanguageModal from "./ArticleLanguageModal";

export default function SharedArticleHandler() {
  const api = useContext(APIContext);
  const { userDetails } = useContext(UserContext);
  const history = useHistory();
  const query = useQuery();
  const sharedUrl = query.get("url");

  const [status, setStatus] = useState("loading");
  const [errorMessage, setErrorMessage] = useState("");
  const [articleInfo, setArticleInfo] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (!sharedUrl) {
      setStatus("error");
      setErrorMessage("No URL provided.");
      return;
    }

    api.findOrCreateArticle(
      { url: sharedUrl, withContent: false },
      (result) => {
        try {
          if (typeof result === "string" && result.includes("Language not supported")) {
            setStatus("error");
            setErrorMessage("This article's language is not supported by Zeeguu.");
            return;
          }

          const artinfo = typeof result === "string" ? JSON.parse(result) : result;
          setArticleInfo(artinfo);
          setStatus("choice");
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

  const navigateToArticle = (id) => {
    history.replace("/read/article?id=" + id);
  };

  const handleTranslateAndAdapt = () => {
    setIsProcessing(true);
    setStatus("loading");
    api.translateAndAdaptArticle(
      articleInfo.url,
      userDetails.learned_language,
      (result) => navigateToArticle(result.id),
      (error) => {
        console.error("Translation failed:", error);
        navigateToArticle(articleInfo.id);
      },
    );
  };

  const handleSimplify = () => {
    setIsProcessing(true);
    setStatus("loading");
    api.simplifyArticle(articleInfo.id, (result) => {
      if (result.status === "success" && result.levels) {
        const simplified = result.levels.find((l) => !l.is_original);
        if (simplified) {
          navigateToArticle(simplified.id);
          return;
        }
      }
      console.error("Simplification failed:", result.message);
      navigateToArticle(articleInfo.id);
    });
  };

  const handleReadOriginal = () => {
    history.replace("/read/article?id=" + articleInfo.id + "&noTranslate=true");
  };

  const handleReadAsIs = () => {
    navigateToArticle(articleInfo.id);
  };

  if (status === "loading") {
    return (
      <div style={{ textAlign: "center", padding: "4em 2em" }}>
        <LoadingAnimation />
        <p>{isProcessing ? "Preparing article..." : "Opening article..."}</p>
      </div>
    );
  }

  if (status === "choice" && articleInfo) {
    return (
      <ArticleLanguageModal
        articleLanguage={articleInfo.language}

        learnedLanguage={userDetails.learned_language}
        source="share"
        onTranslateAndAdapt={handleTranslateAndAdapt}
        onSimplify={handleSimplify}
        onReadOriginal={handleReadOriginal}
        onReadAsIs={handleReadAsIs}
        isLoading={isProcessing}
      />
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
