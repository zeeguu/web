import { useEffect } from "react";
import useOnboardingModal from "./useOnboardingModal";
import { ONBOARDING_MESSAGE_IDS } from "../appConstants";

/**
 * Hook for the PracticeTheseWords onboarding modal.
 * Uses the shared useOnboardingModal primitive with IntersectionObserver trigger:
 * the modal is shown when the "Practice These Words" button scrolls into view.
 */
export default function usePracticeTheseWordsOnboarding(api, buttonElement) {
  const modal = useOnboardingModal(api, ONBOARDING_MESSAGE_IDS.practiceTheseWords);

  useEffect(() => {
    if (!buttonElement) return;
    if (modal.alreadyShown) return;

    const observer = new IntersectionObserver((entries) => {
      if (entries.some((e) => e.isIntersecting)) modal.show();
    });
    observer.observe(buttonElement);
    return () => observer.disconnect();
  }, [buttonElement, modal.alreadyShown, modal.show]);

  return modal;
}
