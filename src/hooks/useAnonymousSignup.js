import { useState } from "react";
import { Capacitor } from "@capacitor/core";

import LocalStorage from "../assorted/LocalStorage";
import { saveLearnedVarietyAfterSignup } from "../utils/misc/saveLearnedVariety";
import { saveSharedUserInfo, setUserSession } from "../utils/cookies/userInfo";

// Helper to detect if we're in a Capacitor native app
const isCapacitor = () => {
  const platform = Capacitor.getPlatform();
  return platform === "ios" || platform === "android";
};

/**
 * Anonymous mode: the native apps always, and web with ?anon=1 for testing.
 */
export function isAnonModeEnabled() {
  const params = new URLSearchParams(window.location.search);
  return params.get("anon") === "1" || isCapacitor();
}

// Generate a UUID v4
function generateUUID() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/**
 * Create the anonymous account and move on to interests.
 *
 * A hook rather than a function on one page because onboarding has two possible
 * last steps -- the language questions, or the country questions after them --
 * and whichever a learner reaches last is the one that has to create the
 * account. Two copies of this would be two copies of a signup.
 *
 * The answers come from LocalStorage rather than from arguments: every step
 * parks its own as it is given, precisely so the step that ends up last does not
 * need to have collected them itself.
 */
export default function useAnonymousSignup(api, onFallback) {
  const [isCreatingAccount, setIsCreatingAccount] = useState(false);

  function createAnonymousAccountAndContinue() {
    setIsCreatingAccount(true);
    const uuid = generateUUID();
    const password = generateUUID();
    const inviteCode = LocalStorage.getInviteCode();
    const translationLanguage = LocalStorage.getNativeLanguage();

    api.addAnonUser(
      uuid,
      password,
      inviteCode,
      {
        learned_language: LocalStorage.getLearnedLanguage(),
        native_language: translationLanguage,
        learned_cefr_level: LocalStorage.getLearnedCefrLevel(),
      },
      (session) => {
        // Store credentials for future sessions
        LocalStorage.setAnonCredentials(uuid, password);

        // Set the session
        setUserSession(session);
        api.setSession(session);

        saveSharedUserInfo({ name: "Guest", native_language: translationLanguage }, session);

        // The account exists now, so the country answers finally have somewhere
        // to go -- and the redirect has to wait for them. This is a full-document
        // navigation, which cancels a fetch still in flight, and a round trip
        // here is routinely slower than the delay below.
        saveLearnedVarietyAfterSignup(api, () => {
          setIsCreatingAccount(false);

          // Small delay to ensure storage is written before redirect
          setTimeout(() => {
            window.location.href = "/select_interests";
          }, 100);
        });
      },
      (error) => {
        console.error("Failed to create anonymous account:", error);
        setIsCreatingAccount(false);
        // Fall back to regular account creation
        onFallback();
      },
    );
  }

  return { isCreatingAccount, createAnonymousAccountAndContinue };
}
