import { useEffect } from "react";
import useOnboardingModal from "./useOnboardingModal";
import { ONBOARDING_MESSAGE_IDS } from "../appConstants";

export default function useListeningOnboarding(api, userDetails) {
  const modal = useOnboardingModal(api, ONBOARDING_MESSAGE_IDS.listening);
  const currentUserId = userDetails?.username;

  useEffect(() => {
    // Trigger when user enters the Listening/Daily Audio tab for first time
    // Only call show() once when alreadyShown becomes false
    if (!currentUserId || !modal.alreadyShown) {
      return;
    }
    modal.show();
  }, [currentUserId, modal.alreadyShown, modal.show]);

  return modal;
}
