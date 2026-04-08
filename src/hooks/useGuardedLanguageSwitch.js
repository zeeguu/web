import { useContext, useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { APIContext } from "../contexts/APIContext";
import { UserContext } from "../contexts/UserContext";
import ChoiceModal from "../components/modal_shared/ChoiceModal";
import useQuery from "./useQuery";
import { switchLanguage } from "../utils/languageSwitcher";
import { LANGUAGE_CODE_TO_NAME } from "../utils/misc/languageCodeToName";

const READER_PATH = "/read/article";

/**
 * Switches the user's learning language, but if the user is currently reading
 * an article, first asks for confirmation. On confirm, the article is saved
 * for later, the language is switched, and the user lands on the recommendations
 * for the new language.
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

  const willConfirm = location.pathname === READER_PATH;

  function requestSwitch(langCode, onDone) {
    if (langCode === userDetails.learned_language) {
      onDone?.();
      return;
    }
    if (!willConfirm) {
      switchLanguage(api, userDetails, setUserDetails, langCode, onDone);
      return;
    }
    setPending({ langCode, onDone });
  }

  function handleConfirm() {
    if (!pending) return;
    setIsProcessing(true);

    // Save the article in parallel — don't block the switch on it.
    const articleId = query.get("id");
    if (articleId) api.makePersonalCopy(articleId, () => {});

    const { langCode, onDone } = pending;
    switchLanguage(api, userDetails, setUserDetails, langCode, () => {
      setIsProcessing(false);
      setPending(null);
      onDone?.();
      history.push("/articles");
    });
  }

  function handleCancel() {
    if (isProcessing) return;
    pending?.onDone?.();
    setPending(null);
  }

  const targetLanguageName = pending ? LANGUAGE_CODE_TO_NAME[pending.langCode] || pending.langCode : "";

  const confirmModal = pending ? (
    <ChoiceModal
      title="Switch language?"
      subtitle={`Your current article will be saved for later, and you'll be taken to your ${targetLanguageName} home.`}
      primaryLabel="Switch"
      secondaryLabel="Keep reading"
      onPrimary={handleConfirm}
      onSecondary={handleCancel}
      isLoading={isProcessing}
      loadingLabel="Switching..."
    />
  ) : null;

  return { requestSwitch, confirmModal, willConfirm };
}
