import { useContext, useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { APIContext } from "../contexts/APIContext";
import { UserContext } from "../contexts/UserContext";
import ChoiceModal from "../components/modal_shared/ChoiceModal";
import useQuery from "./useQuery";
import { switchLanguage } from "../utils/languageSwitcher";
import { languageName } from "../utils/misc/languageCodeToName";

// The reader: /read/article?id=… (in-app) and /read/<link> (article links).
const READER_PATH_PREFIX = "/read/";
const EXERCISES_SUMMARY_PATH = "/practice/summary";

/**
 * Switches the user's learning language, but if the user is currently reading
 * an article, first asks what to do with it:
 *   - Adapt: the article is translated into the new language at the user's
 *     level there, the language is switched, and the user goes on reading the
 *     translation.
 *   - Go home: the article is saved for later, the language is
 *     switched, and the user lands on the recommendations for the new language.
 *   - Closing the dialog keeps reading in the current language.
 *
 * Returns:
 *   requestSwitch(langCode, onDone) — call this instead of switchLanguage()
 *   confirmModal — JSX to render somewhere in the tree (or null)
 *   willConfirm — true if a switch right now would prompt for confirmation;
 *     callers can use this to skip optimistic UI updates that would be wrong
 *     if the user cancels.
 */
export default function useGuardedLanguageSwitch() {
  const api = useContext(APIContext);
  const { userDetails, setUserDetails } = useContext(UserContext);
  const location = useLocation();
  const history = useHistory();
  const query = useQuery();

  const [pending, setPending] = useState(null); // { langCode, onDone }
  const [isProcessing, setIsProcessing] = useState(false);
  const [translationFailed, setTranslationFailed] = useState(false);

  const willConfirm = location.pathname.startsWith(READER_PATH_PREFIX);

  function requestSwitch(langCode, onDone) {
    if (langCode === userDetails.learned_language) {
      onDone?.();
      return;
    }
    if (!willConfirm) {
      // Navigate as the language is applied, so the summary page doesn't
      // re-render with the new language's data layered over the previous
      // session's stats; ExerciseSession mounts straight into its loading
      // state and then fetches for the switched language.
      const leaveSummary =
        location.pathname === EXERCISES_SUMMARY_PATH ? () => history.push("/practice") : undefined;
      switchLanguage(api, userDetails, setUserDetails, langCode, onDone, leaveSummary);
      return;
    }
    setPending({ langCode, onDone });
  }

  // Opened through a link (/read/<link>) there's no id in the URL; resolve it.
  function withArticleId(callback) {
    const articleId = query.get("id");
    const link = location.pathname.slice(READER_PATH_PREFIX.length);
    if (articleId) callback(articleId);
    else if (link) api.getArticleLinkInfo(link, (info) => callback(info.article_id));
  }

  function finish(path) {
    setIsProcessing(false);
    setTranslationFailed(false);
    setPending(null);
    pending.onDone?.();
    if (path) history.push(path);
  }

  function switchWithoutArticle() {
    if (!pending || isProcessing) return;
    setIsProcessing(true);

    // Save the article in parallel — don't block the switch on it.
    withArticleId((articleId) => api.makePersonalCopy(articleId, () => {}));

    switchLanguage(api, userDetails, setUserDetails, pending.langCode, () => finish("/articles"));
  }

  // Translate first and switch after: until the translation is there, the
  // reader can still back out, and a failed translation leaves them where
  // they were. The dialog's spinner covers the wait.
  function translateAndSwitch() {
    if (!pending || isProcessing) return;
    setIsProcessing(true);
    withArticleId((articleId) =>
      api.translateAndAdaptArticle(
        { articleId },
        pending.langCode,
        (translated) => {
          let saved = false;
          switchLanguage(
            api,
            userDetails,
            setUserDetails,
            pending.langCode,
            () => finish(saved ? "/read/article?id=" + translated.id : null),
            () => (saved = true),
          );
        },
        (error) => {
          console.error("Translating the article for the language switch failed:", error);
          setIsProcessing(false);
          setTranslationFailed(true);
        },
      ),
    );
  }

  function handleCancel() {
    if (isProcessing) return;
    pending?.onDone?.();
    setPending(null);
    setTranslationFailed(false);
  }

  const targetLanguageName = pending ? languageName(pending.langCode) : "";

  const message = translationFailed
    ? `The article could not be translated to ${targetLanguageName}. Switch anyway? It will be saved for later.`
    : `Switch to ${targetLanguageName}? You can take this article along, translated to your ${targetLanguageName} level.`;

  const confirmModal = pending ? (
    <ChoiceModal
      message={message}
      primaryLabel={translationFailed ? "Switch" : `Adapt article to my level in ${targetLanguageName}`}
      onPrimary={translationFailed ? switchWithoutArticle : translateAndSwitch}
      secondaryLabel={translationFailed ? "Keep reading" : `Go to my ${targetLanguageName} home`}
      onSecondary={translationFailed ? handleCancel : switchWithoutArticle}
      onCancel={handleCancel}
      isLoading={isProcessing}
      loadingLabel={translationFailed ? "Switching..." : "Adapting..."}
    />
  ) : null;

  return { requestSwitch, confirmModal, willConfirm };
}
