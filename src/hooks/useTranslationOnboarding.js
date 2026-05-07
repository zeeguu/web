import { useCallback, useEffect, useRef, useState } from "react";

export default function useTranslationOnboarding(api, userDetails, onboardingMessageId = 1) {
  const [translationOnboardingOpen, setTranslationOnboardingOpen] = useState(false);
  const translationOnboardingRequestInFlight = useRef(false);
  
  // Use username as the user identifier (no id field in userDetails)
  const currentUserId = userDetails?.username;

  const showTranslationOnboardingIfNeeded = useCallback(async () => {
    if (!currentUserId) return;
    if (translationOnboardingRequestInFlight.current || translationOnboardingOpen) return;
    translationOnboardingRequestInFlight.current = true;
    try {
      let shouldShow = false;
      try {
        const status = await api.getOnboardingMessageStatus(onboardingMessageId);
        shouldShow = !(status?.shown === true || status?.shown === "true");
      } catch (e) {
        // If status check fails, do not show the popup (no local fallback)
        return;
      }

      if (!shouldShow) return;

      await api.markOnboardingMessageShown(onboardingMessageId);
      setTranslationOnboardingOpen(true);
    } finally {
      translationOnboardingRequestInFlight.current = false;
    }
  }, [api, onboardingMessageId, translationOnboardingOpen, currentUserId]);

  useEffect(() => {
    setTranslationOnboardingOpen(false);
    translationOnboardingRequestInFlight.current = false;
  }, [currentUserId]);

  useEffect(() => {
    // Only attach listeners if we have a user ID
    if (!currentUserId) return;

    const handleArticleOpened = () => {
      showTranslationOnboardingIfNeeded();
    };

    const handleBookmarkCreated = () => {
      showTranslationOnboardingIfNeeded();
    };

    window.addEventListener("zeeguu-article-opened", handleArticleOpened);
    window.addEventListener("zeeguu-bookmark-created", handleBookmarkCreated);

    return () => {
      window.removeEventListener("zeeguu-article-opened", handleArticleOpened);
      window.removeEventListener("zeeguu-bookmark-created", handleBookmarkCreated);
    };
  }, [showTranslationOnboardingIfNeeded, currentUserId]);

  return {
    translationOnboardingOpen,
    setTranslationOnboardingOpen,
    onboardingMessageId,
  };
}