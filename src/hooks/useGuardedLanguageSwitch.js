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
  const [failure, setFailure] = useState(null); // what went wrong, told in the dialog

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
  function withArticleId(callback, onError = () => {}) {
    const articleId = query.get("id");
    const link = location.pathname.slice(READER_PATH_PREFIX.length);
    if (articleId) callback(articleId);
    else if (link) api.getArticleLinkInfo(link, (info) => callback(info.article_id), onError);
  }

  function finish(path) {
    setIsProcessing(false);
    setFailure(null);
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

  function fail(message) {
    setIsProcessing(false);
    setFailure(message);
  }

  // Translate first and switch after: a failed translation leaves the reader
  // where they were. The dialog's spinner covers the wait.
  function translateAndSwitch() {
    if (!pending || isProcessing) return;
    setIsProcessing(true);
    withArticleId(translateArticle, translationFailed);
  }

  function translateArticle(articleId) {
    api.translateAndAdaptArticle({ articleId }, pending.langCode, switchToTranslation, translationFailed);
  }

  function switchToTranslation(translated) {
    // onDone also runs when the save failed; onSaved runs before it, on success only.
    let saved = false;
    const onSaved = () => (saved = true);
    const onDone = () => (saved ? finish("/read/article?id=" + translated.id) : switchNotSaved());
    switchLanguage(api, userDetails, setUserDetails, pending.langCode, onDone, onSaved);
  }

  function translationFailed(error) {
    console.error("Translating the article for the language switch failed:", error);
    fail(`The article could not be translated to ${targetLanguageName}. Switch anyway? It will be saved for later.`);
  }

  function switchNotSaved() {
    fail(`The switch to ${targetLanguageName} could not be saved. Try again? The article will be saved for later.`);
  }

  function handleCancel() {
    if (isProcessing) return;
    pending?.onDone?.();
    setPending(null);
    setFailure(null);
  }

  const targetLanguageName = pending ? languageName(pending.langCode) : "";

  const message =
    failure ||
    `Switch to ${targetLanguageName}? You can take this article along, translated to your ${targetLanguageName} level.`;

  const confirmModal = pending ? (
    <ChoiceModal
      message={message}
      primaryLabel={failure ? "Switch" : `Adapt article to my level in ${targetLanguageName}`}
      onPrimary={failure ? switchWithoutArticle : translateAndSwitch}
      secondaryLabel={failure ? "Keep reading" : `Go to my ${targetLanguageName} home`}
      onSecondary={failure ? handleCancel : switchWithoutArticle}
      onCancel={handleCancel}
      isLoading={isProcessing}
      loadingLabel={failure ? "Switching..." : "Adapting..."}
    />
  ) : null;

  return { requestSwitch, confirmModal, willConfirm };
}
