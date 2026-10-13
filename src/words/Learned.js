import { useContext, useEffect, useState } from "react";
import LoadingAnimation from "../components/LoadingAnimation";
import { setTitle } from "../assorted/setTitle";
import strings from "../i18n/definitions";
import LearnedList from "./wordLists/LearnedList";
import { APIContext } from "../contexts/APIContext";

export default function Learned() {
  const api = useContext(APIContext);
  const [learnedWords, setLearnedWords] = useState(null);
  const [totalWordsLearned, setTotalWordsLearned] = useState(0);

  useEffect(() => {
    api.totalLearnedUserWords(setTotalWordsLearned);
    api.learnedUserWords(300, setLearnedWords);
    setTitle(strings.titleLearnedWords);
  }, [api]);

  if (!learnedWords) {
    return <LoadingAnimation />;
  }

  return <LearnedList learnedWords={learnedWords} totalWordsLearned={totalWordsLearned} />;
}
