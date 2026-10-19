import { useContext, useEffect, useState } from "react";
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

  if (scheduledWordCount === undefined) return null;

  if (scheduledWordCount === 0) {
    return (
      <EmptyState
        message={`No words to practice in ${languageName(learnedLanguage)} yet. Words you translate while reading, and words from your audio lessons, will show up here.`}
      />
    );
  }

  return (
    <EmptyState
      message="Words are scheduled according to spaced-repetition principles. You've practiced all the words due for now 🎉"
    />
  );
}
