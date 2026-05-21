import { useEffect } from "react";
import { ONBOARDING_MESSAGE_IDS } from "../appConstants";
import useOnboardingModal from "./useOnboardingModal";

/**
 * Hook for the Learning Levels onboarding modal.
 * Triggered when the user first encounters a word level > 0,
 * which indicates they've completed an exercise and progressed a level.
 */
export default function useLearningLevelsOnboarding(api, userDetails) {
  const modal = useOnboardingModal(api, ONBOARDING_MESSAGE_IDS.learningLevels);
  const currentUserId = userDetails?.username;

  useEffect(() => {
    if (!currentUserId || modal.alreadyShown) return;

    const handleWordLevelShown = () => {
      modal.show();
    };

    window.addEventListener("zeeguu-word-level-shown", handleWordLevelShown);
    return () => {
      window.removeEventListener("zeeguu-word-level-shown", handleWordLevelShown);
    };
  }, [currentUserId, modal.alreadyShown, modal.show]);

  return modal;
}
