import { useState, useEffect, useContext } from "react";
import { useHistory } from "react-router-dom";
import { APIContext } from "../contexts/APIContext";
import { UserContext } from "../contexts/UserContext";
import useQuery from "../hooks/useQuery";
import LoadingAnimation from "../components/LoadingAnimation";
import ArticleLanguageModal from "./ArticleLanguageModal";
import ErrorDialog from "../components/ErrorDialog";
import { shouldShowLanguageChoice, getUserCefrLevel, numericToCefr } from "../utils/misc/userCefrLevel";

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
            img_url: upload.img_url || null,
            cefr_level: upload.cefr_level || null,
          });
          setStatus("choice");
        },
        () => {
          setStatus("error");
          setErrorMessage("Could not load the uploaded article.");
        },
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
        createAndNavigate(false);
      },
      (error) => {
        setStatus("error");
        setErrorMessage("Failed to load article. It may be behind a paywall or not readable.");
      },
    );
  }, [sharedUrl, uploadId]);

  const navigateToArticle = (id, noTranslate) => {
    const path = "/read/article?id=" + id + (noTranslate ? "&noTranslate=true" : "");
    history.replace(path);
  };

  const beginProcessing = () => {
    setIsProcessing(true);
    setStatus("loading");
  };

  const onConversionError = (errorMessage) => {
    setStatus("error");
    // Surface the server's message when it's human-readable (the API sends
    // actionable text like "…too long… try a single chapter" as JSON
    // `message`). Fall back to a friendly generic for bare "HTTP 4xx" or
    // network strings, which aren't useful to a reader.
    const isBareHttpCode =
      typeof errorMessage === "string" && /^HTTP \d+$/.test(errorMessage.trim());
    setErrorMessage(
      errorMessage && !isBareHttpCode
        ? errorMessage
        : "Could not process this article. It may be too long, or the source may be blocking us — try a shorter piece or a single chapter.",
    );
  };

  const runArticleConversion = (apiFn, noTranslate) => {
    beginProcessing();
    apiFn(uploadId, (result) => navigateToArticle(result.id, noTranslate), onConversionError);
  };

  const createAndNavigate = (noTranslate) => {
    beginProcessing();
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
    if (uploadId) return runArticleConversion(api.translateAndAdaptArticleUpload.bind(api));
    beginProcessing();
    api.translateAndAdaptArticle(
      { url: sharedUrl, articleId: articleDetection?.id },
      userDetails.learned_language,
      (result) => navigateToArticle(result.id),
      (error) => {
        console.error("Translation failed:", error);
        createAndNavigate(false);
      },
    );
  };

  const handleSimplify = () => {
    if (uploadId) return runArticleConversion(api.simplifyArticleUpload.bind(api));
    beginProcessing();
    api.findOrCreateArticle(
      { url: sharedUrl },
      (result) => {
        const artinfo = typeof result === "string" ? JSON.parse(result) : result;
        api.simplifyArticle(artinfo.id, (simplifyResult) => {
          // Backend returns levels for both "success" (just simplified) and
          // "already_done" (existing version at user's level) — handle both.
          const simplified = simplifyResult.levels?.find((l) => !l.is_original);
          if (simplified) {
            navigateToArticle(simplified.id);
            return;
          }
          console.error(
            "Simplification failed:",
            simplifyResult.message || simplifyResult.error || simplifyResult.status,
          );
          navigateToArticle(artinfo.id);
        });
      },
      onConversionError,
    );
  };

  const handleReadOriginal = () => {
    if (uploadId) return runArticleConversion(api.promoteArticleUpload.bind(api), true);
    createAndNavigate(true);
  };

  // Backing out of the choice: nothing has been saved yet, so leave for the
  // feed without creating or adapting anything. Replace rather than push, so
  // Back doesn't land on the share handler and ask the same question again.
  const handleCancel = () => history.replace("/articles");

  const handleReadAsIs = () => {
    if (uploadId) return runArticleConversion(api.promoteArticleUpload.bind(api), false);
    createAndNavigate(false);
  };

  if (status === "loading") {
    // One line for the whole wait; LoadingAnimation reassures during it
    // ("Still working…", then the vocabulary drill).
    const message = isProcessing ? "Preparing your article…" : "Opening article…";
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
        userCefrLevel={numericToCefr(getUserCefrLevel(userDetails, userDetails.learned_language))}
        source="share"
        onTranslateAndAdapt={handleTranslateAndAdapt}
        onSimplify={handleSimplify}
        onReadOriginal={handleReadOriginal}
        onReadAsIs={handleReadAsIs}
        onCancel={handleCancel}
        isLoading={isProcessing}
      />
    );
  }

  if (status === "error") {
    return (
      <ErrorDialog
        title="Could not open article"
        message={errorMessage}
        detail={sharedUrl || (uploadId ? `upload #${uploadId}` : null)}
        onBack={() => history.push("/articles")}
      />
    );
  }

  return null;
}
