import React, { Fragment, useEffect, useState } from "react";
import TimeSelector from "./TimeSelector";
import LocalStorage from "../assorted/LocalStorage";
import { useParams } from "react-router-dom";
import PractisedWordsCard from "./PractisedWordsCard";
import WordCountCard from "./WordCountCard";
import { StyledButton } from "./TeacherButtons.sc";
import WordsDropDown from "./WordsDropDown";
import strings from "../i18n/definitions";
import { DUMMYWORDS } from "./DUMMIES_TO_DELETE";

export default function StudentExercisesInsights({ api }) {
  const [forceUpdate, setForceUpdate] = useState(0);
  const selectedTimePeriod = LocalStorage.selectedTimePeriod();
  const studentID = useParams().studentID;
  const cohortID = useParams().cohortID;
  const [studentInfo, setStudentInfo] = useState({});
  const [doneExercises, setDoneExercises] = useState(null);
  const [isOpen, setIsOpen] = useState("");

  useEffect(() => {
    api.getExerciseHistory(
      studentID,
      selectedTimePeriod,
      cohortID,
      (res) => {
        console.log("Success!!!");
        setDoneExercises(res);
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
    doneExercises &&
    studentInfo.name +
      strings.hasCompleted +
      "X" +
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
            correctness="XX%"
            time="X min"
          />
        </StyledButton>
        <StyledButton naked onClick={() => handleCardClick("learned")}>
          <WordCountCard
            isOpen={isOpen === "learned"}
            headline="Learned words"
            wordCount="XX"
          />
        </StyledButton>
        <StyledButton naked onClick={() => handleCardClick("non-studied")}>
          <WordCountCard
            isOpen={isOpen === "non-studied"}
            headline="Words not studied in Zeeguu"
            wordCount="XX"
          />
        </StyledButton>
      </div>
      {isOpen !== "" && <WordsDropDown card={isOpen} practisedWords={doneExercises} words={DUMMYWORDS} />}
    </Fragment>
  );
}
