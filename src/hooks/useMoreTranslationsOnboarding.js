import { useEffect } from "react";
import { ONBOARDING_MESSAGE_IDS } from "../appConstants";
import useOnboardingModal from "./useOnboardingModal";

export default function useMoreTranslationsOnboarding(api, userDetails) {
  const modal = useOnboardingModal(api, ONBOARDING_MESSAGE_IDS.moreTranslations);
  const currentUserId = userDetails?.username;

  useEffect(() => {
    if (!currentUserId || modal.alreadyShown) return;

    window.addEventListener("zeeguu-translation-with-alternatives", modal.show);
    return () => {
      window.removeEventListener("zeeguu-translation-with-alternatives", modal.show);
    };
  }, [currentUserId, modal.alreadyShown, modal.show]);

  return modal;
}
