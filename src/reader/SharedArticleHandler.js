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
  const uploadId = query.get("upload_id");

  const [status, setStatus] = useState("loading");
  const [errorMessage, setErrorMessage] = useState("");
  const [articleDetection, setArticleDetection] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (uploadId) {
      api.getArticleUpload(
        uploadId,
        (upload) => {
          setArticleDetection({
            language: upload.language,
            title: upload.title,
            url: upload.url,
          });
          setStatus("choice");
        },
        () => {
          setStatus("error");
          setErrorMessage("Could not load the uploaded article.");
        }
      );
      return;
    }

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
  }, [sharedUrl, uploadId]);

  const navigateToArticle = (id, noTranslate) => {
    const path = "/read/article?id=" + id + (noTranslate ? "&noTranslate=true" : "");
    history.replace(path);
  };

  const onDerivationError = () => {
    setStatus("error");
    setErrorMessage("Could not process this article.");
  };

  // URL-based (iOS share) path: create the article in DB on choice.
  const createAndNavigate = (noTranslate) => {
    setIsProcessing(true);
    setStatus("loading");
    api.findOrCreateArticle(
      { url: sharedUrl },
      (result) => {
        const artinfo = typeof result === "string" ? JSON.parse(result) : result;
        navigateToArticle(artinfo.id, noTranslate);
      },
      onDerivationError,
    );
  };

  const handleTranslateAndAdapt = () => {
    setIsProcessing(true);
    setStatus("loading");
    if (uploadId) {
      api.translateAndAdaptArticleUpload(
        uploadId,
        (result) => navigateToArticle(result.id),
        onDerivationError,
      );
      return;
    }
    api.translateAndAdaptArticle(
      sharedUrl,
      userDetails.learned_language,
      (result) => navigateToArticle(result.id),
      (error) => {
        console.error("Translation failed:", error);
        createAndNavigate(false);
      },
    );
  };

  const handleSimplify = () => {
    setIsProcessing(true);
    setStatus("loading");
    if (uploadId) {
      api.simplifyArticleUpload(
        uploadId,
        (result) => navigateToArticle(result.id),
        onDerivationError,
      );
      return;
    }
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
      onDerivationError,
    );
  };

  const handleReadOriginal = () => {
    if (uploadId) {
      setIsProcessing(true);
      setStatus("loading");
      api.promoteArticleUpload(
        uploadId,
        (artinfo) => navigateToArticle(artinfo.id, true),
        onDerivationError,
      );
      return;
    }
    createAndNavigate(true);
  };

  const handleReadAsIs = () => {
    if (uploadId) {
      setIsProcessing(true);
      setStatus("loading");
      api.promoteArticleUpload(
        uploadId,
        (artinfo) => navigateToArticle(artinfo.id, false),
        onDerivationError,
      );
      return;
    }
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
          {sharedUrl || (uploadId && `upload #${uploadId}`)}
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
