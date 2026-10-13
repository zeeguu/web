import { useContext, useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { APIContext } from "../../../contexts/APIContext";
import LoadingAnimation from "../../../components/LoadingAnimation";
import TopTabs from "../../../components/TopTabs";
import { CenteredContentContainer } from "../../../components/ColumnWidth.sc";
import LearningLists from "../../../words/wordLists/LearningLists";
import LearnedList from "../../../words/wordLists/LearnedList";
import WordAttempts from "./WordAttempts";

// A student's words as they see them on their own Words pages (in exercises,
// learned), plus what the old Exercises tab added: each word's attempts with
// the kind of exercise, and the words left out of exercises.
export default function StudentWords() {
  const api = useContext(APIContext);
  const { studentID, cohortID } = useParams();
  const [lists, setLists] = useState(null);
  const path = useLocation().pathname;
  const base = `/teacher/classes/viewStudent/${studentID}/class/${cohortID}/words`;

  useEffect(() => {
    setLists(null);
    api.getStudentWordLists(studentID, cohortID, setLists, () =>
      setLists({ scheduled: [], next_in_learning: [], excluded: [], learned: [], total_learned: 0 }),
    );
  }, [api, studentID, cohortID]);

  if (!lists) return <LoadingAnimation />;

  const views = [
    { text: `In exercises (${lists.scheduled.length})`, link: base, isActive: (_, loc) => loc.pathname === base },
    { text: `Learned (${lists.total_learned})`, link: `${base}/learned` },
  ];

  let content = (
    <LearningLists
      inLearning={lists.scheduled}
      nextInLearning={lists.next_in_learning}
      excluded={lists.excluded}
      forTeacher={true}
      wordExtras={(word) => <WordAttempts attempts={word.exercise_attempts} />}
    />
  );
  if (path.endsWith("/learned")) {
    content = (
      <LearnedList
        learnedWords={lists.learned}
        totalWordsLearned={lists.total_learned}
        forTeacher={true}
        wordExtras={(word) => <WordAttempts attempts={word.exercise_attempts} />}
      />
    );
  }

  return (
    <CenteredContentContainer>
      <TopTabs tabsAndLinks={views} isCompact={true} />
      {content}
    </CenteredContentContainer>
  );
}
