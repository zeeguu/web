import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import EmptyState from "../components/EmptyState";
import { APIContext } from "../contexts/APIContext";
import { UserContext } from "../contexts/UserContext";
import { languageName } from "../utils/misc/languageCodeToName";

export default function OutOfWordsMessage() {
  const api = useContext(APIContext);
  const { userDetails } = useContext(UserContext);
  const learnedLanguage = userDetails?.learned_language;

  // Counted in the learned language: userDetails.bookmark_count spans all
  // languages, so a learner who just added one would be told they had
  // practised everything due.
  const [scheduledWordCount, setScheduledWordCount] = useState();
  useEffect(() => {
    setScheduledWordCount();
    // If the count fails, show the "all practiced" message, not a blank page.
    api.getCountOfAllScheduledUserWords((count) => setScheduledWordCount(count), {
      onError: () => setScheduledWordCount(null),
    });
  }, [api, learnedLanguage]);

  // Words translated while the exercises are full wait outside them, and the
  // learner sees only "all practiced". If any wait, the exercises are full:
  // with room to spare the session would have picked them up already.
  const [hasWaitingWords, setHasWaitingWords] = useState();
  useEffect(() => {
    setHasWaitingWords();
    api.getUserWordsNextInLearning((words) => setHasWaitingWords(Array.isArray(words) && words.length > 0), {
      onError: () => setHasWaitingWords(false),
    });
  }, [api, learnedLanguage]);

  if (scheduledWordCount === undefined || hasWaitingWords === undefined) return null;

  if (scheduledWordCount === 0) {
    return (
      <EmptyState
        message={`No words to practice in ${languageName(learnedLanguage)} yet. Words you translate while reading, and words from your audio lessons, will show up here.`}
      />
    );
  }

  if (hasWaitingWords) {
    const waitingMessage = (
      <>
        You've practiced all the words due for now 🎉 Your new words are waiting: they join your exercises as you learn
        the ones you're practicing. You can also{" "}
        <Link to="/account_settings/exercise_scheduling">practice more words at a time</Link>.
      </>
    );
    return <EmptyState message={waitingMessage} />;
  }

  return (
    <EmptyState
      message="Words are scheduled according to spaced-repetition principles. You've practiced all the words due for now 🎉"
    />
  );
}
