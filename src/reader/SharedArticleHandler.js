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
  const [articleDetection, setArticleDetection] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (!sharedUrl) {
      setStatus("error");
      setErrorMessage("No URL provided.");
      return;
    }

    // Lightweight detection: just get language + title, no DB creation
    api.detectArticleInfo(
      sharedUrl,
      (result) => {
        setArticleDetection(result);
        setStatus("choice");
      },
      (error) => {
        setStatus("error");
        setErrorMessage(
          "Failed to load article. It may be behind a paywall or not readable."
        );
      }
    );
  }, [sharedUrl]);

  const navigateToArticle = (id, noTranslate) => {
    const path = "/read/article?id=" + id + (noTranslate ? "&noTranslate=true" : "");
    history.replace(path);
  };

  // Create the article in DB (deferred until user makes a choice)
  const createAndNavigate = (noTranslate) => {
    setIsProcessing(true);
    setStatus("loading");
    api.findOrCreateArticle(
      { url: sharedUrl },
      (result) => {
        const artinfo = typeof result === "string" ? JSON.parse(result) : result;
        navigateToArticle(artinfo.id, noTranslate);
      },
      (error) => {
        setStatus("error");
        setErrorMessage("Could not process this article.");
      }
    );
  };

  const handleTranslateAndAdapt = () => {
    setIsProcessing(true);
    setStatus("loading");
    api.translateAndAdaptArticle(
      sharedUrl,
      userDetails.learned_language,
      (result) => navigateToArticle(result.id),
      (error) => {
        console.error("Translation failed:", error);
        // Fall back to creating original article
        createAndNavigate(false);
      },
    );
  };

  const handleSimplify = () => {
    // Need to create article first, then simplify
    setIsProcessing(true);
    setStatus("loading");
    api.findOrCreateArticle(
      { url: sharedUrl },
      (result) => {
        const artinfo = typeof result === "string" ? JSON.parse(result) : result;
        api.simplifyArticle(artinfo.id, (simplifyResult) => {
          if (simplifyResult.status === "success" && simplifyResult.levels) {
            const simplified = simplifyResult.levels.find((l) => !l.is_original);
            if (simplified) {
              navigateToArticle(simplified.id);
              return;
            }
          }
          console.error("Simplification failed:", simplifyResult.message);
          navigateToArticle(artinfo.id);
        });
      },
      (error) => {
        setStatus("error");
        setErrorMessage("Could not process this article.");
      }
    );
  };

  const handleReadOriginal = () => {
    createAndNavigate(true);
  };

  const handleReadAsIs = () => {
    createAndNavigate(false);
  };

  if (status === "loading") {
    return (
      <div style={{ textAlign: "center", padding: "4em 2em" }}>
        <LoadingAnimation />
        <p>{isProcessing ? "Preparing article..." : "Opening article..."}</p>
      </div>
    );
  }

  if (status === "choice" && articleDetection) {
    return (
      <ArticleLanguageModal
        articleLanguage={articleDetection.language}
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
