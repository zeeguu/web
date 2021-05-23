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
      word: "practised1",
      translation: "oversættelse1",
      exerciseAttempts: [
        { date: "Jan 1. 2020", type: "recognise", attempts: "hws" },
        { date: "Jan 2. 2020", type: "multiple choice", attempts: "whc" },
        { date: "Jan 3. 2020", type: "multiple choice", attempts: "whhhc" },
        { date: "Jan 3. 2020", type: "multiple choice", attempts: "hhhhhhhhhhs" },
        { date: "Jan 3. 2020", type: "multiple choice", attempts: "hc" },
      ],
    },
    {
      word: "practised2",
      translation: "oversættelse2",
      exerciseAttempts: [
        { date: "Feb 1. 2020", type: "recognise", attempts: "wwhc" },
        { date: "Feb 2. 2020", type: "multiple choice", attempts: "s" },
      ],
    },
    {
      word: "practised3",
      translation: "oversættelse3",
      exerciseAttempts: [
        { date: "Mar 1. 2020", type: "recognise", attempts: "wc" },
        { date: "Mar 2. 2020", type: "multiple choice", attempts: "c" },
      ],
    },
    {
      word: "practised4",
      translation: "oversættelse4",
      exerciseAttempts: [
        { date: "Apr 1. 2020", type: "recognise", attempts: "hw hc" },
        { date: "Apr 2. 2020", type: "multiple choice", attempts: "c" },
      ],
    },
    {
      word: "practised5",
      translation: "oversættelse5",
      exerciseAttempts: [
        { date: "May 1. 2020", type: "recognise", attempts: "hhhc" },
        { date: "May 2. 2020", type: "multiple choice", attempts: "c" },
        { date: "Jan 3. 2020", type: "multiple choice", attempts: "wwws" },
        { date: "Jan 3. 2020", type: "multiple choice", attempts: "hc" },
      ],
    },
  ];
  const learnedWords = [
    {
      word: "learned1",
      translation: "oversættelse1",
      exerciseAttempts: [
        { date: "Jun 1. 2020", type: "recognise", attempts: "wwhc" },
        { date: "Jun 2. 2020", type: "multiple choice", attempts: "c" },
      ],
    },
    {
      word: "learned2",
      translation: "oversættelse2",
      exerciseAttemps: [{ type: "recognise", attempts: "whs" }],
    },
    {
      word: "learned3",
      translation: "oversættelse3",
      exerciseAttempts: [
        { date: "Jul 1. 2020", type: "recognise", attempts: "wwhc" },
        { date: "Jul 2. 2020", type: "multiple choice", attempts: "c" },
      ],
    },
  ];
  const nonStudyWords = [
    {
      word: "non-study1",
      translation: "oversættelse1",
      exerciseAttempts: [
        { date: "Aug 1. 2020", type: "recognise", attempts: "wwhc" },
        { date: "Aug 2. 2020", type: "multiple choice", attempts: "c" },
      ],
    },
    {
      word: "non-study2",
      translation: "oversættelse2",
      exerciseAttempts: [
        { date: "Sep 1. 2020", type: "recognise", attempts: "wwhc" },
        { date: "Sep 2. 2020", type: "multiple choice", attempts: "c" },
      ],
    },
    {
      word: "non-study3",
      translation: "oversættelse3",
      exerciseAttempts: [
        { date: "Oct 1. 2020", type: "recognise", attempts: "wwhc" },
        { date: "Oct 2. 2020", type: "multiple choice", attempts: "c" },
      ],
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
          headline="Practised words - translated and exercised by the student STRINGS"
          words={practisedWords}
        />
      )}
      {isOpen === "learned" && (
        <WordsDropDown
          headline="Word practised correctly on four different days STRINGS"
          words={learnedWords}
        />
      )}
      {isOpen === "non-studied" && (
        <WordsDropDown
          headline="Words translated by the student that will never be studied in Zeeguu STRINGS"
          words={nonStudyWords}
        />
      )}
    </Fragment>
  );
}
