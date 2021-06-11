import React, { Fragment, useEffect, useState } from "react";
import TimeSelector from "./TimeSelector";
import LocalStorage from "../assorted/LocalStorage";
import { useParams } from "react-router-dom";
import PractisedWordsCard from "./PractisedWordsCard";
import WordCountCard from "./WordCountCard";
import { StyledButton } from "./TeacherButtons.sc";
import WordsDropDown from "./WordsDropDown";
import strings from "../i18n/definitions";
import { DUMMYLEARNEDWORDS, DUMMYWORDS } from "./DUMMIES_TO_DELETE";

export default function StudentExercisesInsights({ api }) {
  const [forceUpdate, setForceUpdate] = useState(0);
  const selectedTimePeriod = LocalStorage.selectedTimePeriod();
  const studentID = useParams().studentID;
  const cohortID = useParams().cohortID;
  const [studentInfo, setStudentInfo] = useState({});
  const [isOpen, setIsOpen] = useState("");
  const [practisedWords, setPractisedWords] = useState([]);
  const [completedExercises, setCompletedExercises] = useState(0);
  const [activity, setActivity] = useState(null);

  useEffect(() => {
    setCompletedExercises(0);
    api.getExerciseHistory(
      studentID,
      selectedTimePeriod,
      cohortID,
      (practisedWordsInDB) => {
        setPractisedWords(practisedWordsInDB);
        practisedWordsInDB.forEach((word) => {
          const attempts = parseInt(word.exerciseAttempts.length);
          setCompletedExercises((prev) => prev + attempts);
        });
      },
      (error) => {
        console.log(error);
      }
    );

    api.getStudentActivityOverview(
      studentID,
      selectedTimePeriod,
      cohortID,
      (activity) => {
        console.log(activity);
        setActivity(activity);
      },
      (error) => {
        console.log(error);
      }
    );

    // eslint-disable-next-line
  }, [selectedTimePeriod]);

  useEffect(() => {
    api.loadUserInfo(studentID, selectedTimePeriod, (userInfo) => {
      setStudentInfo(userInfo);
    });
    // eslint-disable-next-line
  }, [forceUpdate]);

  const customText =
    practisedWords &&
    studentInfo.name +
      strings.hasCompleted +
      completedExercises +
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
            wordCount="XX"
            correctness={activity && activity.correct_on_1st_try * 100 + "%"}
            time="XX min"
          />
        </StyledButton>
        <StyledButton naked onClick={() => handleCardClick("learned")}>
          <WordCountCard
            isOpen={isOpen === "learned"}
            headline={strings.titleLearnedWords}
            wordCount={activity ? activity.learned_words_count: ""}
          />
        </StyledButton>
        <StyledButton naked onClick={() => handleCardClick("non-studied")}>
          <WordCountCard
            isOpen={isOpen === "non-studied"}
            headline={strings.wordsNotStudiedInZeeguu}
            wordCount={activity ? activity.translated_but_not_practiced_words_count : ""}
          />
        </StyledButton>
      </div>
      {isOpen !== "" && (
        <WordsDropDown
          api={api}
          card={isOpen}
          practisedWords={practisedWords}
        />
      )}
    </Fragment>
  );
}
