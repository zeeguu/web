import React, { useState, Fragment, useEffect } from "react";
import { useParams } from "react-router";
import { v4 as uuid } from "uuid";
import LocalStorage from "../../../assorted/LocalStorage";
import ExerciseType from "./ExerciseType";
import { shortFormattedDate } from "../../sharedComponents/FormattedDate";
import strings from "../../../i18n/definitions";
import * as s from "../../styledComponents/LearnedWordsList.sc";

const LearnedWordsList = ({ api }) => {
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
      }
    );
    //eslint-disable-next-line
  }, [selectedTimePeriod]);

  const reason = (word) => {
    if (word.self_reported === true) {
      return <ExerciseType source="FEEDBACK" />;
    } else {
      return (
        <s.StyledLearnedWordsList>
          <Fragment>
            <ExerciseType source="LEARNED" />
            <p className="date-of-word-learned">
              {shortFormattedDate(word.learned_time)}
            </p>
          </Fragment>
        </s.StyledLearnedWordsList>
      );
    }
  };

  return (
    <s.StyledLearnedWordsList>
      <Fragment>
        {learnedWords.length === 0 && (
          <p className="no-learned-words-string">
            {strings.studentHasNotLearnedWords}
          </p>
        )}
        {learnedWords.map((word) => (
          <div key={uuid() + word}>
            <div className="learned-words-container">
              <p className="learned-word-translation">
                {word.translation.toLowerCase()}
              </p>
              <p className="learned-word-string">
                <b>{word.word}</b>
              </p>
              <div className="learned-words-student-feedback-container">
                {reason(word)}
              </div>
            </div>
          </div>
        ))}
      </Fragment>
    </s.StyledLearnedWordsList>
  );
};
export default LearnedWordsList;
