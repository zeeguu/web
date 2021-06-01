import React, { Fragment, useEffect, useState } from "react";
import TimeSelector from "./TimeSelector";
import LocalStorage from "../assorted/LocalStorage";
import { useParams } from "react-router-dom";
import PractisedWordsCard from "./PractisedWordsCard";
import WordCountCard from "./WordCountCard";
import { StyledButton } from "./TeacherButtons.sc";
import WordsDropDown from "./WordsDropDown";
import { DUMMYWORDS } from "./DUMMIES_TO_DELETE";

export default function StudentExercisesInsights({ api }) {
  const [forceUpdate, setForceUpdate] = useState(0);
  const selectedTimePeriod = LocalStorage.selectedTimePeriod();
  const studentID = useParams().studentID;
  const cohortID = useParams().cohortID;
  const [studentInfo, setStudentInfo] = useState({});
  const [doneExercises, setDoneExercises] = useState(null);
  const [isOpen, setIsOpen] = useState("");

  const practisedWords = DUMMYWORDS

  useEffect(() => {
    api.loadUserInfo(studentID, selectedTimePeriod, (userInfo) => {
      setStudentInfo(userInfo);
    });
    
    // eslint-disable-next-line
  }, [forceUpdate]);

  useEffect(() => {
    api.getExerciseHistory(
      studentID,
      selectedTimePeriod,
      cohortID,
      (res) => {
        console.log("Success");
        console.log(res);
        setDoneExercises(DUMMYWORDS);
      },
      (error) => {
        console.log(error);
      }
    );
    // eslint-disable-next-line
  }, [selectedTimePeriod]);

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
      {isOpen !== "" && <WordsDropDown card={isOpen} words={practisedWords} />}
    </Fragment>
  );
}
