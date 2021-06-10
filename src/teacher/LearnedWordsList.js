import React, { useState, Fragment, useEffect } from "react";
import { useParams } from "react-router";
import { v4 as uuid } from "uuid";
import LocalStorage from "../assorted/LocalStorage";
import ExerciseType from "./ExerciseType";
import { formatedDateWithDay } from "./FormatedDate";

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
        <Fragment>
          <ExerciseType source="LEARNED" />
          <p style={{ color: "#808080" }}>
            {formatedDateWithDay(word.learned_time)}
          </p>
        </Fragment>
      );
    }
  };

  return (
    <Fragment>
      {learnedWords.length === 0 && (
        <p style={{ fontSize: "medium" }}>
          The student has not learned any words yet. STRINGS
        </p>
      )}
      {learnedWords.map((word) => (
        <div key={uuid() + word}>
          <div
            style={{
              borderLeft: "solid 3px #5492b3",
              marginBottom: "38px",
              minWidth: 270,
              userSelect: "none",
            }}
          >
            <p
              style={{
                color: "#44cdff",
                marginBottom: "-15px",
                marginTop: "0px",
                marginLeft: "1em",
              }}
            >
              {word.translation.toLowerCase()}
            </p>
            <p style={{ marginLeft: "1em", marginBottom: "-5px" }}>
              <b>{word.word}</b>
            </p>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                marginLeft: "1em",
                fontSize: "small",
                marginBottom: "-25px",
              }}
            >
              {reason(word)}
            </div>
          </div>
        </div>
      ))}
    </Fragment>
  );
};
export default LearnedWordsList;
