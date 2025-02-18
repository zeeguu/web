import { Fragment, useContext, useEffect, useState } from "react";
import { AttemptIcons } from "./AttemptIcons";
import { v4 as uuid } from "uuid";
import { shortFormattedDate } from "../../sharedComponents/FormattedDate";
import ExerciseType from "./ExerciseType";
import { useParams } from "react-router";
import LocalStorage from "../../../assorted/LocalStorage";
import strings from "../../../i18n/definitions";
import * as s from "../../styledComponents/PractisedWordsList.sc";
import { APIContext } from "../../../contexts/APIContext";

const PractisedWordsList = () => {
  const api = useContext(APIContext);
  const [practisedWords, setPractisedWords] = useState([]);
  const selectedTimePeriod = LocalStorage.selectedTimePeriod();
  const studentID = useParams().studentID;
  const cohortID = useParams().cohortID;

  useEffect(() => {
    api.getExerciseHistory(
      studentID,
      selectedTimePeriod,
      cohortID,
      (practisedWordsInDB) => {
        setPractisedWords(practisedWordsInDB);
      },
      (error) => {
        console.log(error);
      },
    );
    //eslint-disable-next-line
  }, []);

  return (
    <Fragment>
      {practisedWords.length === 0 && (
        <p style={{ fontSize: "medium" }}>{strings.noPractisedWordsYet}</p>
      )}
      {practisedWords &&
        practisedWords.map((word) => (
          <div key={word + uuid()}>
            <s.StyledPractisedWordsList>
              <div key={uuid()} className="practised-words-container">
                <p className="word-practised">
                  <b>{word.word}</b>
                </p>
                <p className="translation-of-practised-word">
                  {word.translation.toLowerCase()}
                </p>
                {word.exerciseAttempts.map((exercise) => (
                  <div key={uuid()} className="practised-word-date-and-icons">
                    <p className="word-practised-date">
                      {shortFormattedDate(exercise.time)}
                    </p>
                    <ExerciseType source={exercise.source} />
                    <AttemptIcons attemptString={exercise.outcome} />
                  </div>
                ))}
              </div>
            </s.StyledPractisedWordsList>
          </div>
        ))}
    </Fragment>
  );
};
export default PractisedWordsList;
