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
  const practisedWords = [
    {
      word: "learned1",
      translation: "lært1",
      isStudied: "true",
      isLearned: "true",
      exerciseAttempts: [
        { date: "Jan 1. 2020", type: "recognise", attempts: "c", feedback:"" },
        { date: "Jan 2. 2020", type: "multiple choice", attempts: "whc", feedback:"" },
        { date: "Jan 3. 2020", type: "multiple choice", attempts: "c", feedback:"" },
        { date: "Jan 4. 2020", type: "multiple choice", attempts: "c", feedback:"" },
        { date: "Jan 5. 2020", type: "multiple choice", attempts: "c", feedback:"" },
      ],
      exclusionReason:""
    },
    {
      word: "practised1",
      translation: "øvet1",
      isStudied: "true",
      isLearned: "false",
      exerciseAttempts: [
        { date: "Feb 1. 2020", type: "recognise", attempts: "wwhc", feedback:"" },
        { date: "Feb 2. 2020", type: "multiple choice", attempts: "s", feedback:"" },
      ],
      exclusionReason:""
    },
    {
      word: "practised2",
      translation: "øvet2",
      isStudied: "true",
      isLearned: "false",
      exerciseAttempts: [
        { date: "Mar 1. 2020", type: "recognise", attempts: "wc", feedback:"" },
        { date: "Mar 2. 2020", type: "multiple choice", attempts: "c", feedback:"Too easy" },
      ],
      exclusionReason:""
    },
    {
      word: "practised3",
      translation: "øvet3",
      isStudied: "true",
      isLearned: "false",
      exerciseAttempts: [
        { date: "Apr 1. 2020", type: "recognise", attempts: "hwhc", feedback:"" },
        { date: "Apr 2. 2020", type: "multiple choice", attempts: "c", feedback:"" },
      ],
      exclusionReason:""
    },
    {
      word: "non-studied1",
      translation: "ikke-øvet1",
      isStudied: "false",
      isLearned: "false",
      exerciseAttempts: [],
      exclusionReason:"Excluded by algorithm"
    },
    {
      word: "non-studied2",
      translation: "ikke-øvet2",
      isStudied: "false",
      isLearned:"false",
      exerciseAttempts: [],
      exclusionReason:"Excluded by algorithm"
    },
    {
      word: "non-studied3",
      translation: "ikke-øvet3",
      isStudied: "false",
      isLearned:"false",
      exerciseAttempts: [],
      exclusionReason:"Scheduled - not yet practiced"
    },
    {
      word: "practised4",
      translation: "øvet4",
      isStudied: "true",
      isLearned: "false",
      exerciseAttempts: [
        { date: "Apr 1. 2020", type: "recognise", attempts: "hwhs", feedback:"" },
        { date: "Apr 2. 2020", type: "multiple choice", attempts: "hh", feedback:"Too hard" },
      ],
      exclusionReason:""
    },
    {
      word: "practised5",
      translation: "øvet5",
      isStudied: "true",
      isLearned: "false",
      exerciseAttempts: [
        { date: "May 1. 2020", type: "recognise", attempts: "hhhc" },
        { date: "May 2. 2020", type: "multiple choice", attempts: "c" },
        { date: "Jan 3. 2020", type: "multiple choice", attempts: "wwws" },
        { date: "Jan 3. 2020", type: "multiple choice", attempts: "hc" },
      ],
      exclusionReason:""
    },
  ];

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
