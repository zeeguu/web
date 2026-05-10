import { useEffect, useRef, useState } from "react";

export default function useReviewWordsOnboarding(
  api,
  userDetails,
  articleID,
  readerReady,
  reviewWordsButtonElement,
  onboardingMessageId = 3,
) {
  const [reviewWordsOnboardingOpen, setReviewWordsOnboardingOpen] = useState(false);
  const reviewWordsOnboardingRequestInFlight = useRef(false);
  const hasTriggeredForCurrentArticle = useRef(false);
  const currentUserId = userDetails?.username;

  useEffect(() => {
    hasTriggeredForCurrentArticle.current = false;
    setReviewWordsOnboardingOpen(false);
    reviewWordsOnboardingRequestInFlight.current = false;
  }, [currentUserId, articleID]);

  useEffect(() => {
    if (!currentUserId || !articleID || !readerReady) {
      return;
    }

    const buttonElement = reviewWordsButtonElement;
    if (!buttonElement || hasTriggeredForCurrentArticle.current) {
      return;
    }

    let cancelled = false;

    const triggerOnboarding = async () => {
      if (
        cancelled ||
        hasTriggeredForCurrentArticle.current ||
        reviewWordsOnboardingRequestInFlight.current
      ) {
        return;
      }

      reviewWordsOnboardingRequestInFlight.current = true;
      try {
        const status = await api.getOnboardingMessageStatus(onboardingMessageId);

        if (cancelled || status?.shown === true || status?.shown === "true") {
          hasTriggeredForCurrentArticle.current = true;
          return;
        }

        await api.markOnboardingMessageShown(onboardingMessageId);

        if (!cancelled) {
          hasTriggeredForCurrentArticle.current = true;
          setReviewWordsOnboardingOpen(true);
        }
      } catch {
      } finally {
        reviewWordsOnboardingRequestInFlight.current = false;
      }
    };

    const isVisible = () => {
      const rect = buttonElement.getBoundingClientRect();
      return rect.top < window.innerHeight && rect.bottom > 0;
    };

    if (typeof IntersectionObserver !== "undefined") {
      const getScrollParent = (node) => {
        let parent = node.parentElement;
        while (parent && parent !== document.body) {
          const style = getComputedStyle(parent);
          if (/(auto|scroll)/.test(style.overflow + style.overflowY + style.overflowX)) return parent;
          parent = parent.parentElement;
        }
        return null;
      };

      const scrollParent = getScrollParent(buttonElement) || null;

      const observer = new IntersectionObserver(
        (entries) => {
          if (entries.some((entry) => entry.isIntersecting)) {
            triggerOnboarding();
          }
        },
        { root: scrollParent, threshold: 0.1 },
      );

      observer.observe(buttonElement);

      return () => {
        cancelled = true;
        observer.disconnect();
      };
    }

    const fallbackCheck = () => {
      if (isVisible()) triggerOnboarding();
    };

    fallbackCheck();

    const scrollParentForFallback = (function () {
      let p = buttonElement.parentElement;
      while (p && p !== document.body) {
        const style = getComputedStyle(p);
        if (/(auto|scroll)/.test(style.overflow + style.overflowY + style.overflowX)) return p;
        p = p.parentElement;
      }
      return window;
    })();

    scrollParentForFallback.addEventListener("scroll", fallbackCheck, true);
    window.addEventListener("resize", fallbackCheck);

    return () => {
      cancelled = true;
      scrollParentForFallback.removeEventListener("scroll", fallbackCheck, true);
      window.removeEventListener("resize", fallbackCheck);
    };
  }, [api, articleID, currentUserId, onboardingMessageId, readerReady, reviewWordsButtonElement]);

  return {
    reviewWordsOnboardingOpen,
    setReviewWordsOnboardingOpen,
    onboardingMessageId,
  };
}