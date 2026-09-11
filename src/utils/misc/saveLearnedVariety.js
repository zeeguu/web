import LocalStorage from "../../assorted/LocalStorage";

// How long onboarding will wait for the save before moving on regardless. Long
// enough for a slow mobile round trip, short enough that a hung request does not
// strand someone on the last step of signup.
const GIVE_UP_AFTER_MS = 2500;

/**
 * Persist the country choices made during onboarding, once the account exists.
 *
 * Two of them now: which country's news to read, and which variety the audio
 * lessons are spoken in. The signup endpoints take a learned language and a
 * level but neither of these, and both are preferences rather than part of an
 * identity -- so rather than widening three account-creation paths, the choices
 * wait in LocalStorage and are saved with the new session. /user_settings
 * accepts them on their own.
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
  const dialect = LocalStorage.getLearnedDialect();
  if (!variety && !dialect) {
    onDone();
    return;
  }

  let settled = false;
  function finish() {
    if (settled) return;
    settled = true;
    onDone();
  }

  // Only what was actually answered. An empty string is a real value to this
  // endpoint -- it clears a preference -- so sending one for a control the
  // learner never reached would be saving an answer they did not give.
  const details = {};
  if (variety) details.feed_variety = variety;
  if (dialect) details.dialect = dialect;

  api.saveUserDetails(details, finish, finish);
  setTimeout(finish, GIVE_UP_AFTER_MS);
}
