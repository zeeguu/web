import { useEffect } from "react";
import { ONBOARDING_MESSAGE_IDS } from "../appConstants";
import useOnboardingModal from "./useOnboardingModal";

export default function useTranslationOnboarding(api, userDetails) {
  const modal = useOnboardingModal(api, ONBOARDING_MESSAGE_IDS.translation);
  const currentUserId = userDetails?.username;

  useEffect(() => {
    
    if (!currentUserId || modal.alreadyShown) return;

    window.addEventListener("zeeguu-article-opened", modal.show);
    window.addEventListener("zeeguu-bookmark-created", modal.show);
    return () => {
      window.removeEventListener("zeeguu-article-opened", modal.show);
      window.removeEventListener("zeeguu-bookmark-created", modal.show);
    };

  }, [currentUserId, modal.alreadyShown, modal.show]);

  return modal;
}