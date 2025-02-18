import React, { Fragment, useContext, useEffect, useState } from "react";
import TimeSelector from "../../sharedComponents/TimeSelector";
import LocalStorage from "../../../assorted/LocalStorage";
import { useParams } from "react-router-dom";
import PractisedWordsCard from "./PractisedWordsCard";
import WordCountCard from "./WordCountCard";
import { StyledButton } from "../../styledComponents/TeacherButtons.sc";
import WordsDropDown from "./WordsDropDown";
import { convertTime } from "../../sharedComponents/FormattedTime";
import strings from "../../../i18n/definitions";
import * as s from "../../styledComponents/StudentExercisesInsights.sc";
import { APIContext } from "../../../contexts/APIContext";

export default function StudentExercisesInsights() {
  const api = useContext(APIContext);
  const [forceUpdate, setForceUpdate] = useState(0);
  const selectedTimePeriod = LocalStorage.selectedTimePeriod();
  const studentID = useParams().studentID;
  const cohortID = useParams().cohortID;
  const [studentName, setStudentName] = useState("");
  const [exerciseTime, setExerciseTime] = useState("");
  const [completedExercisesCount, setCompletedExercisesCount] = useState(0);
  const [practisedWordsCount, setPractisedWordsCount] = useState(0);
  const [activity, setActivity] = useState(null);
  const [isOpen, setIsOpen] = useState("");

  useEffect(() => {
    api.getStudentInfo(
      studentID,
      cohortID,
      selectedTimePeriod,
      (studentInfo) => setStudentName(studentInfo.name),
      (error) => console.log(error),
    );

    api.getStudentActivityOverview(
      studentID,
      selectedTimePeriod,
      cohortID,
      (activity) => {
        setActivity(activity);
        convertTime(activity.exercise_time, setExerciseTime);
        setPractisedWordsCount(activity.practiced_words_count);
        setCompletedExercisesCount(activity.number_of_exercises);
      },
      (error) => console.log(error),
    );
    // eslint-disable-next-line
  }, [forceUpdate]);

  const customText =
    studentName +
    strings.hasCompleted +
    completedExercisesCount +
    strings.exercisesInTheLast;

  const handleCardClick = (cardName) => {
    if (isOpen === cardName) {
      setIsOpen("");
    } else {
      setIsOpen(cardName);
    }
  };

  return (
    <s.StyledStudentExercisesInsights>
      <Fragment>
        <TimeSelector setForceUpdate={setForceUpdate} customText={customText} />
        <div className="exercise-insight-sections">
          <StyledButton naked onClick={() => handleCardClick("practised")}>
            <PractisedWordsCard
              isOpen={isOpen === "practised"}
              wordCount={practisedWordsCount}
              correctness={
                activity && Math.round(activity.correct_on_1st_try * 100) + "%"
              }
              time={exerciseTime}
            />
          </StyledButton>
          <StyledButton naked onClick={() => handleCardClick("learned")}>
            <WordCountCard
              isOpen={isOpen === "learned"}
              headline={strings.titleLearnedWords}
              wordCount={activity ? activity.learned_words_count : ""}
            />
          </StyledButton>
          <StyledButton naked onClick={() => handleCardClick("non-studied")}>
            <WordCountCard
              isOpen={isOpen === "non-studied"}
              headline={strings.wordsNotStudiedInZeeguu}
              wordCount={
                activity
                  ? activity.translated_but_not_practiced_words_count
                  : ""
              }
            />
          </StyledButton>
        </div>
        {isOpen !== "" && <WordsDropDown card={isOpen} />}
      </Fragment>
    </s.StyledStudentExercisesInsights>
  );
}
