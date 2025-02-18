import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router";
import { v4 as uuid } from "uuid";
import LocalStorage from "../../../assorted/LocalStorage";
import ExerciseType from "./ExerciseType";
import strings from "../../../i18n/definitions";
import * as s from "../../styledComponents/LearnedWordsList.sc";
import { APIContext } from "../../../contexts/APIContext";

const LearnedWordsList = () => {
  const api = useContext(APIContext);
  const selectedTimePeriod = LocalStorage.selectedTimePeriod();
  const studentID = useParams().studentID;
  const cohortID = useParams().cohortID;
  const [learnedWords, setLearnedWords] = useState([]);

  useEffect(() => {
    api.getLearnedWords(
      studentID,
      selectedTimePeriod,
      cohortID,
      (learnedWordsInDB) => {
        setLearnedWords(learnedWordsInDB);
      },
      (error) => {
        console.log(error);
      },
    );
    //eslint-disable-next-line
  }, [selectedTimePeriod]);

  const reason = (word) => {
    if (word.self_reported === true) {
      return <ExerciseType source="FEEDBACK" />;
    } else {
      return (
        <s.StyledLearnedWordsList>
          <ExerciseType source="LEARNED" date={word.learned_time} />
        </s.StyledLearnedWordsList>
      );
    }
  };

  return (
    <s.StyledLearnedWordsList>
      <div className="list-container">
        {learnedWords.length === 0 && (
          <p className="no-learned-words-string">
            {strings.studentHasNotLearnedWords}
          </p>
        )}
        {learnedWords.map((word) => (
          <div key={uuid() + word}>
            <div className="learned-word-card">
              <p className="learned-word">
                <b>{word.word}</b>
              </p>
              <p className="learned-word-translation">
                {word.translation.toLowerCase()}
              </p>
              {reason(word)}
            </div>
          </div>
        ))}
      </div>
    </s.StyledLearnedWordsList>
  );
};
export default LearnedWordsList;
