import React, { Fragment, useEffect, useState } from "react";
import TimeSelector from "./TimeSelector";
import LocalStorage from "../assorted/LocalStorage";
import { useParams } from "react-router-dom";
import ReadingInsightHeader from "./ReadingInsightHeader";
import ReadingInsightAccordion from "./ReadingInsightAccordion";

export default function StudentReadingInsights({ api }) {
  const [forceUpdate, setForceUpdate] = useState(0);
  const selectedTimePeriod = LocalStorage.selectedTimePeriod();
  const studentID = useParams().studentID;
  const cohortID = useParams().cohortID;
  const [studentInfo, setStudentInfo] = useState({});
  const [readArticles, setReadArticles] = useState(null);

  useEffect(() => {
    api.loadUserInfo(studentID, selectedTimePeriod, (userInfo) => {
      setStudentInfo(userInfo);
    });
    api.getReadingSessions(
      studentID,
      cohortID,
      selectedTimePeriod,
      (readingSessions) => {
        setReadArticles(readingSessions);
      },
      (res) => {
        console.log(res);
      }
    );
    // eslint-disable-next-line
  }, [forceUpdate]);

  const customText =
    readArticles &&
    studentInfo.name +
      " has read " +
      readArticles.length +
      " texts in the last ";
  return (
    <Fragment>
      <TimeSelector setForceUpdate={setForceUpdate} customText={customText} />
      <ReadingInsightHeader />
      <ReadingInsightAccordion readArticles={readArticles} />
    </Fragment>
  );
}
