import LocalStorage from "../../assorted/LocalStorage";

/**
 * Persist the variety chosen during onboarding, once the account exists.
 *
 * The signup endpoints take a learned language and a level but no variety, and
 * a variety is a preference rather than part of an identity -- so rather than
 * widening three account-creation paths, the choice waits in LocalStorage and is
 * saved with the new session. /user_settings accepts a variety on its own.
 *
 * A failure here is deliberately silent: the account was created, the learner is
 * on their way to the feed, and a preference they can also set in Settings is not
 * worth interrupting that for.
 */
export function saveLearnedVarietyAfterSignup(api) {
  const variety = LocalStorage.getLearnedVariety();
  if (!variety) return;

  api.saveUserDetails(
    { variety },
    () => {},
    () => {},
  );
}
