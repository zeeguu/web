import { useEffect } from "react";
import useOnboardingModal from "./useOnboardingModal";
import { ONBOARDING_MESSAGE_IDS } from "../appConstants";

export default function useListeningOnboarding(api, userDetails) {
  const modal = useOnboardingModal(api, ONBOARDING_MESSAGE_IDS.listening);

  useEffect(() => {
    // Trigger when user enters the Listening/Daily Audio tab for first time
    // Only call show() once when alreadyShown becomes false
    if (!modal.alreadyShown) {
      modal.show();
    }
  }, [modal.alreadyShown, modal]); // Track alreadyShown change explicitly

  return modal;
}
