import React, { Fragment, useEffect, useState } from "react";
import TimeSelector from "./TimeSelector";
import LocalStorage from "../assorted/LocalStorage";
import { useParams } from "react-router-dom";
import PractisedWordsCard from "./PractisedWordsCard";
import WordCountCard from "./WordCountCard";
import { StyledButton } from "./TeacherButtons.sc";
import WordsDropDown from "./WordsDropDown";
import { convertTime } from "./FormatedTime";
import strings from "../i18n/definitions";

export default function StudentExercisesInsights({ api }) {
  const [forceUpdate, setForceUpdate] = useState(0);
  const selectedTimePeriod = LocalStorage.selectedTimePeriod();
  const studentID = useParams().studentID;
  const cohortID = useParams().cohortID;
  const [studentName, setStudentName] = useState({});
  const [exerciseTime, setExerciseTime] = useState("");
  const [practisedWordsCount, setPractisedWordsCount] = useState(0);
  const [activity, setActivity] = useState(null);
  const [isOpen, setIsOpen] = useState("");

  useEffect(() => {
    api.loadUserInfo(studentID, selectedTimePeriod, (student) =>
      setStudentName(student.name)
    );

    api.getStudentActivityOverview(
      studentID,
      selectedTimePeriod,
      cohortID,
      (activity) => {
        setActivity(activity);
        convertTime(activity.exercise_time_in_sec, setExerciseTime);
        setPractisedWordsCount(activity.practiced_words_count);
      },
      (error) => {
        console.log(error);
      }
    );

    // eslint-disable-next-line
  }, [forceUpdate]);

  const customText =
    activity &&
    studentName.name +
      strings.hasCompleted +
      practisedWordsCount +
      strings.exercisesInTheLast;

  const handleCardClick = (cardName) => {
    if (isOpen === cardName) {
      setIsOpen("");
    } else {
      setIsOpen(cardName);
    }
  };

  return (
    <Fragment>
      <TimeSelector setForceUpdate={setForceUpdate} customText={customText} />
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
        }}
      >
        <StyledButton naked onClick={() => handleCardClick("practised")}>
          <PractisedWordsCard
            isOpen={isOpen === "practised"}
            wordCount={practisedWordsCount}
            correctness={activity && activity.correct_on_1st_try * 100 + "%"}
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
              activity ? activity.translated_but_not_practiced_words_count : ""
            }
          />
        </StyledButton>
      </div>
      {isOpen !== "" && <WordsDropDown api={api} card={isOpen} />}
    </Fragment>
  );
}
