import { useEffect } from "react";
import useOnboardingModal from "./useOnboardingModal";
import { ONBOARDING_MESSAGE_IDS } from "../appConstants";

/**
 * Hook for the DailyExercises onboarding modal.
 * Uses the shared useOnboardingModal primitive with automatic trigger:
 * the modal is shown when user enters the Exercises tab for the first time.
 */
export default function useDailyExercisesOnboarding(api, userDetails) {
  const modal = useOnboardingModal(api, ONBOARDING_MESSAGE_IDS.dailyExercises);
  const currentUserId = userDetails?.username;

  useEffect(() => {
    // Skip if no logged-in user or modal already shown
    if (!currentUserId || modal.alreadyShown) return;

    // Dispatch event when exercises tab is accessed
    window.dispatchEvent(new CustomEvent("zeeguu-exercises-opened"));
    modal.show();
  }, [currentUserId, modal.alreadyShown, modal.show]);

  return modal;
}
