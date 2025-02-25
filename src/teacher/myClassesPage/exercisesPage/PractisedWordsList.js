import { useContext, useEffect, useState } from "react";
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
    <>
      {practisedWords.length === 0 && (
        <p style={{ fontSize: "medium" }}>{strings.noPractisedWordsYet}</p>
      )}
      {practisedWords &&
        practisedWords.map((word) => (
          <s.StyledPractisedWordsList key={word + uuid()}>
            <div key={uuid()} className="practised-words-container">
              <p className="word-practised">
                <b>{word.word}</b>
              </p>
              <p className="translation-of-practised-word">
                {word.translation.toLowerCase()}
              </p>
              <div key={uuid()} className="table">
                {word.exerciseAttempts.map((exercise) => (
                  <tr>
                    <td className="col">
                      <span className="word-practised-date">
                        {shortFormattedDate(exercise.time)}
                      </span>
                    </td>
                    <td>
                      <ExerciseType className="col" source={exercise.source} />
                    </td>
                    <td>
                      {" "}
                      <AttemptIcons
                        className="col"
                        attemptString={exercise.outcome}
                      />
                    </td>
                  </tr>
                ))}
              </div>
            </div>
          </s.StyledPractisedWordsList>
        ))}
    </>
  );
};
export default PractisedWordsList;
