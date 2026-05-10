import { useCallback, useState } from "react";

export default function useMoreTranslationsOnboarding(api, onboardingMessageId = 2) {
  const [moreTranslationsOnboardingOpen, setMoreTranslationsOnboardingOpen] = useState(false);

  const openMoreTranslationsOnboarding = useCallback(async () => {
    if (!onboardingMessageId) return false;

    try {
      const status = await api.getOnboardingMessageStatus(onboardingMessageId);

      if (status?.shown === true || status?.shown === "true") {
        return false;
      }

      await api.markOnboardingMessageShown(onboardingMessageId);
      setMoreTranslationsOnboardingOpen(true);
      return true;
    } catch (e) {
      return false;
    }
  }, [api, onboardingMessageId]);

  const closeMoreTranslationsOnboarding = useCallback(() => {
    setMoreTranslationsOnboardingOpen(false);
  }, []);

  return {
    moreTranslationsOnboardingOpen,
    openMoreTranslationsOnboarding,
    closeMoreTranslationsOnboarding,
  };
}