import { useState, useEffect, useContext } from "react";
import { useHistory } from "react-router-dom";
import { APIContext } from "../contexts/APIContext";
import { UserContext } from "../contexts/UserContext";
import useQuery from "../hooks/useQuery";
import useTimedProgressMessage from "../hooks/useTimedProgressMessage";
import LoadingAnimation from "../components/LoadingAnimation";
import ArticleLanguageModal from "./ArticleLanguageModal";
import { shouldShowLanguageChoice } from "../utils/misc/cefrHelpers";

const PROGRESS_STAGES = {
  simplify: [
    { atSeconds: 0, message: "Sending article to Zeeguu…" },
    { atSeconds: 3, message: "Reading the article…" },
    { atSeconds: 10, message: "Rewriting for your level…" },
    { atSeconds: 25, message: "Almost there — longer articles take a moment…" },
  ],
  translate: [
    { atSeconds: 0, message: "Sending article to Zeeguu…" },
    { atSeconds: 3, message: "Reading the article…" },
    { atSeconds: 8, message: "Translating and adapting to your level…" },
    { atSeconds: 25, message: "Almost there — longer articles take a moment…" },
  ],
  promote: [
    { atSeconds: 0, message: "Sending article to Zeeguu…" },
    { atSeconds: 3, message: "Preparing the article…" },
    { atSeconds: 10, message: "Almost ready…" },
  ],
};

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
  const [processingAction, setProcessingAction] = useState(null);

  const progressMessage = useTimedProgressMessage(
    isProcessing && processingAction ? PROGRESS_STAGES[processingAction] : null,
  );

  useEffect(() => {
    if (uploadId) {
      api.getArticleUpload(
        uploadId,
        (upload) => {
          setArticleDetection({
            language: upload.language,
            title: upload.title,
            url: upload.url,
            img_url: upload.img_url || null,
            cefr_level: upload.cefr_level || null,
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
        // Skip modal when simplification wouldn't help — see shouldShowLanguageChoice.
        if (shouldShowLanguageChoice(result.language, result.cefr_level, userDetails)) {
          setStatus("choice");
          return;
        }
        // detect_article_info already created/found the article when it was
        // cached — short-circuit to avoid a second findOrCreateArticle call.
        if (result.exists && result.id) {
          history.replace("/read/article?id=" + result.id);
          return;
        }
        createAndNavigate("promote", false);
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

  const beginProcessing = (action) => {
    setIsProcessing(true);
    setProcessingAction(action);
    setStatus("loading");
  };

  const onConversionError = () => {
    setStatus("error");
    setErrorMessage("Could not process this article.");
  };

  const runArticleConversion = (apiFn, action, noTranslate) => {
    beginProcessing(action);
    apiFn(uploadId, (result) => navigateToArticle(result.id, noTranslate), onConversionError);
  };

  const createAndNavigate = (action, noTranslate) => {
    beginProcessing(action);
    api.findOrCreateArticle(
      { url: sharedUrl },
      (result) => {
        const artinfo = typeof result === "string" ? JSON.parse(result) : result;
        navigateToArticle(artinfo.id, noTranslate);
      },
      onConversionError,
    );
  };

  const handleTranslateAndAdapt = () => {
    if (uploadId) return runArticleConversion(api.translateAndAdaptArticleUpload.bind(api), "translate");
    beginProcessing("translate");
    api.translateAndAdaptArticle(
      sharedUrl,
      userDetails.learned_language,
      (result) => navigateToArticle(result.id),
      (error) => {
        console.error("Translation failed:", error);
        createAndNavigate("promote", false);
      },
    );
  };

  const handleSimplify = () => {
    if (uploadId) return runArticleConversion(api.simplifyArticleUpload.bind(api), "simplify");
    beginProcessing("simplify");
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
      onConversionError,
    );
  };

  const handleReadOriginal = () => {
    if (uploadId) return runArticleConversion(api.promoteArticleUpload.bind(api), "promote", true);
    createAndNavigate("promote", true);
  };

  const handleReadAsIs = () => {
    if (uploadId) return runArticleConversion(api.promoteArticleUpload.bind(api), "promote", false);
    createAndNavigate("promote", false);
  };

  if (status === "loading") {
    const message = isProcessing
      ? progressMessage || "Preparing article…"
      : "Opening article…";
    return (
      <LoadingAnimation
        /* Simplification / translation routinely take 15-25s — hold back the
           "Report Issue" affordance so users don't think something's broken. */
        reportIssueDelay={30000}
        specificStyle={{ minHeight: "70vh", justifyContent: "center" }}
      >
        <div style={{ textAlign: "center", marginTop: "1em" }}>{message}</div>
      </LoadingAnimation>
    );
  }

  if (status === "choice" && articleDetection) {
    return (
      <ArticleLanguageModal
        articleTitle={articleDetection.title}
        articleLanguage={articleDetection.language}
        articleCefrLevel={articleDetection.cefr_level}
        articleImage={articleDetection.img_url}
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
          {sharedUrl || (uploadId ? `upload #${uploadId}` : null)}
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
