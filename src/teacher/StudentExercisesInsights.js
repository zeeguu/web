import React, { Fragment, useEffect, useState } from "react";
import TimeSelector from "./TimeSelector";
import LocalStorage from "../assorted/LocalStorage";
import { useParams } from "react-router-dom";
import PractisedWordsCard from "./PractisedWordsCard";
import WordCountCard from "./WordCountCard";
import { StyledButton } from "./TeacherButtons.sc";
import WordsDropDown from "./WordsDropDown";

export default function StudentExercisesInsights({ api }) {
  const [forceUpdate, setForceUpdate] = useState(0);
  const selectedTimePeriod = LocalStorage.selectedTimePeriod();
  const studentID = useParams().studentID;
  const cohortID = useParams().cohortID;
  const [studentInfo, setStudentInfo] = useState({});
  const [doneExercises, setDoneExercises] = useState(null);
  const [isOpen, setIsOpen] = useState("");
  const practisedWords = ["pWord1", "pWord2"];
  const learnedWords = ["lWord1", "lWord2"];
  const nonStudyWords = ["nsWord1", "nsWord2"];

  useEffect(() => {
    api.loadUserInfo(studentID, selectedTimePeriod, (userInfo) => {
      setStudentInfo(userInfo);
    });
    setDoneExercises(["ex1", "ex2"]);
    // eslint-disable-next-line
  }, [forceUpdate]);

  const customText =
    doneExercises &&
    studentInfo.name +
      " has completed " +
      doneExercises.length +
      " exercises in the last ";

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
          <PractisedWordsCard wordCount="XX" correctness="XX%" time="X min" />
        </StyledButton>
        <StyledButton naked onClick={() => handleCardClick("learned")}>
          <WordCountCard headline="Learned words" wordCount="XX" />
        </StyledButton>
        <StyledButton naked onClick={() => handleCardClick("non-studied")}>
          <WordCountCard
            headline="Words not studied in Zeeguu"
            wordCount="XX"
          />
        </StyledButton>
      </div>
      {isOpen === "practised" && (
        <WordsDropDown
          headline="Practised words - latest four exercises for each word"
          words={practisedWords}
        />
      )}
      {isOpen === "learned" && (
        <WordsDropDown
          headline="Word practised correctly on four different days"
          words={learnedWords}
        />
      )}
      {isOpen === "non-studied" && (
        <WordsDropDown
          headline="Words translated by the student that will never be studied in Zeeguu"
          words={nonStudyWords}
        />
      )}
    </Fragment>
  );
}
