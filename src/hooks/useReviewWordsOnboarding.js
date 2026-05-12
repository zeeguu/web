import { useEffect } from "react";
import useOnboardingModal from "./useOnboardingModal";
import { ONBOARDING_MESSAGE_IDS } from "../appConstants";

export default function useReviewWordsOnboarding(api, articleID, readerReady, buttonElement) {
  const modal = useOnboardingModal(api, ONBOARDING_MESSAGE_IDS.reviewWords);

  useEffect(() => {
    if (!articleID || !readerReady || !buttonElement) return;
    if (modal.alreadyShown) return;

    const observer = new IntersectionObserver((entries) => {
      if (entries.some((e) => e.isIntersecting)) modal.show();
    });
    observer.observe(buttonElement);
    return () => observer.disconnect();
  }, [articleID, readerReady, buttonElement, modal.alreadyShown, modal.show]);

  return modal;
}
