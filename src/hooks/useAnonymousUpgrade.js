import { useState, useEffect, useContext } from "react";
import { useLocation } from "react-router-dom";
import { UserContext } from "../contexts/UserContext";
import LocalStorage from "../assorted/LocalStorage";

const BOOKMARK_THRESHOLD = 5;
const DAYS_THRESHOLD = 3;

// Settings paths that should trigger upgrade prompt for anonymous users
const SETTINGS_PATHS_THAT_TRIGGER = [
  "/account_settings/profile_details",
  "/account_settings/language_settings",
  "/account_settings/exercise_types",
  "/account_settings/exercise_scheduling",
  "/account_settings/interests",
];

/**
 * Hook to manage anonymous user upgrade prompts.
 *
 * Triggers upgrade prompt when:
 * - User has saved 5+ bookmarks, OR
 * - User returns after 3+ days, OR
 * - User visits settings pages (they want to customize = invested)
 *
 * Returns:
 * - shouldShowUpgrade: boolean - whether to show the upgrade modal
 * - triggerReason: "bookmarks" | "days" | "settings" | null - why the prompt was triggered
 * - bookmarkCount: number - current bookmark count
 * - dismissUpgrade: function - call to dismiss (won't show again this session)
 * - checkUpgradeTrigger: function - manually check if upgrade should be shown
 */
export default function useAnonymousUpgrade() {
  const { userDetails } = useContext(UserContext);
  const location = useLocation();
  const [shouldShowUpgrade, setShouldShowUpgrade] = useState(false);
  const [triggerReason, setTriggerReason] = useState(null);
  const [hasChecked, setHasChecked] = useState(false);
  const [settingsPromptShown, setSettingsPromptShown] = useState(false);
  // Track bookmarks added this session (added to server count)
  const [sessionBookmarks, setSessionBookmarks] = useState(0);

  const serverBookmarkCount = userDetails?.bookmark_count || 0;
  const bookmarkCount = serverBookmarkCount + sessionBookmarks;
  const isAnonymous = userDetails?.is_anonymous || false;

  function checkUpgradeTrigger(reason = null) {
    // Don't show if not anonymous
    if (!isAnonymous) {
      setShouldShowUpgrade(false);
      return;
    }

    // Don't show if already dismissed (except for settings - always allow that)
    if (LocalStorage.isAnonUpgradeDismissed() && reason !== "settings") {
      setShouldShowUpgrade(false);
      return;
    }

    // If a specific reason is provided, use it
    if (reason) {
      setTriggerReason(reason);
      setShouldShowUpgrade(true);
      return;
    }

    // Check bookmark threshold
    if (bookmarkCount >= BOOKMARK_THRESHOLD) {
      setTriggerReason("bookmarks");
      setShouldShowUpgrade(true);
      return;
    }

    // Check days threshold
    const daysSinceFirstUse = LocalStorage.getDaysSinceFirstUse();
    if (daysSinceFirstUse >= DAYS_THRESHOLD) {
      setTriggerReason("days");
      setShouldShowUpgrade(true);
      return;
    }

    setShouldShowUpgrade(false);
  }

  function dismissUpgrade() {
    setShouldShowUpgrade(false);
    // Note: The modal component handles setting the dismissed flag in LocalStorage
  }

  // Check on mount and when userDetails changes
  useEffect(() => {
    if (userDetails && !hasChecked) {
      // Small delay to avoid showing immediately on page load
      const timer = setTimeout(() => {
        checkUpgradeTrigger();
        setHasChecked(true);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [userDetails, hasChecked]);

  // Re-check when bookmark count changes (user saved a new word)
  useEffect(() => {
    if (hasChecked && isAnonymous && bookmarkCount >= BOOKMARK_THRESHOLD) {
      checkUpgradeTrigger();
    }
  }, [bookmarkCount]);

  // Check when navigating to settings pages
  useEffect(() => {
    if (!isAnonymous || settingsPromptShown) return;

    const isSettingsPage = SETTINGS_PATHS_THAT_TRIGGER.some(
      (path) => location.pathname === path
    );

    if (isSettingsPage) {
      // Small delay so page renders first
      const timer = setTimeout(() => {
        setSettingsPromptShown(true);
        checkUpgradeTrigger("settings");
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [location.pathname, isAnonymous, settingsPromptShown]);

  // Listen for bookmark creation events
  useEffect(() => {
    if (!isAnonymous) return;

    const handleBookmarkCreated = () => {
      setSessionBookmarks((prev) => prev + 1);
    };

    window.addEventListener('zeeguu-bookmark-created', handleBookmarkCreated);
    return () => {
      window.removeEventListener('zeeguu-bookmark-created', handleBookmarkCreated);
    };
  }, [isAnonymous]);

  return {
    shouldShowUpgrade,
    triggerReason,
    bookmarkCount,
    dismissUpgrade,
    checkUpgradeTrigger,
    isAnonymous,
  };
}
