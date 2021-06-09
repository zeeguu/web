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
  const [isOpen, setIsOpen] = useState("");
  const [practisedWords, setPractisedWords] = useState([]);
  const [completedExercises, setCompletedExercises] = useState(0);
  const [learnedWords, setLearnedWords] = useState([])
  const [nonStudiedWords, setNonStudiedWords] = useState([])

  useEffect(() => {
    setCompletedExercises(0)
    api.getExerciseHistory(
      studentID,
      selectedTimePeriod,
      cohortID,
      (practisedWordsInDB) => {
        setPractisedWords(practisedWordsInDB);
        practisedWordsInDB.forEach((word) => {
          const attempts = parseInt(word.exerciseAttempts.length)
          setCompletedExercises((prev)=>prev+attempts)
        });
      },
      (error) => {
        console.log(error);
      }
    );

    api.getLearnedWords(
      studentID,
      selectedTimePeriod,
      cohortID,
      (learnedWordsInDB) => {
        setLearnedWords(learnedWordsInDB);
      },
      (error) => {
        console.log(error);
      }
    );

    api.getNonStudiedWords(
      studentID,
      selectedTimePeriod,
      cohortID,
      (nonStudiedWordsInDB) => {
        setNonStudiedWords(nonStudiedWordsInDB);
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

  const practisedWordsCount = practisedWords.length
  const learnedWordsCount = learnedWords.length
  const nonStudiedWordsCount = nonStudiedWords.length

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
            wordCount={practisedWordsCount}
            correctness="XX%"
            time="X min"
          />
        </StyledButton>
        <StyledButton naked onClick={() => handleCardClick("learned")}>
          <WordCountCard
            isOpen={isOpen === "learned"}
            headline="Learned words"
            wordCount={learnedWordsCount}
          />
        </StyledButton>
        <StyledButton naked onClick={() => handleCardClick("non-studied")}>
          <WordCountCard
            isOpen={isOpen === "non-studied"}
            headline="Words not studied in Zeeguu"
            wordCount={nonStudiedWordsCount}
          />
        </StyledButton>
      </div>
      {isOpen !== "" && (
        <WordsDropDown
          card={isOpen}
          practisedWords={practisedWords}
          learnedWords={learnedWords}
          nonStudiedWords={nonStudiedWords}
          words={DUMMYWORDS}
        />
      )}
    </Fragment>
  );
}
