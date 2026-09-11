import LocalStorage from "../../assorted/LocalStorage";

// How long onboarding will wait for the save before moving on regardless. Long
// enough for a slow mobile round trip, short enough that a hung request does not
// strand someone on the last step of signup.
const GIVE_UP_AFTER_MS = 2500;

/**
 * Persist the variety chosen during onboarding, once the account exists.
 *
 * The signup endpoints take a learned language and a level but no variety, and
 * a variety is a preference rather than part of an identity -- so rather than
 * widening three account-creation paths, the choice waits in LocalStorage and is
 * saved with the new session. /user_settings accepts a variety on its own.
 *
 * `onDone` runs once the save has settled, succeeded or failed, and callers that
 * are about to leave the page must wait for it: this goes out as a plain fetch,
 * and a full-document navigation cancels one still in flight. It also runs when
 * there is nothing to save and when the request takes too long, so it is always
 * safe to make the redirect depend on it.
 *
 * A failure is otherwise silent: the account was created, the learner is on
 * their way to the feed, and a preference they can also set in Settings is not
 * worth interrupting that for.
 */
export function saveLearnedVarietyAfterSignup(api, onDone = () => {}) {
  const variety = LocalStorage.getLearnedVariety();
  if (!variety) {
    onDone();
    return;
  }

  let settled = false;
  function finish() {
    if (settled) return;
    settled = true;
    onDone();
  }

  api.saveUserDetails({ variety }, finish, finish);
  setTimeout(finish, GIVE_UP_AFTER_MS);
}
