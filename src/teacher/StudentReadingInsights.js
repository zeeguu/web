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
  const [activityData, setActivityData] = useState(null);
  const [numberOfReadingSessions, setNumberOfReadingSessions] = useState(0);

  useEffect(() => {
    api.loadUserInfo(studentID, selectedTimePeriod, (userInfo) => {
      console.log(userInfo);
      setStudentInfo(userInfo);
    });
    api.loadUserSessions(studentID, selectedTimePeriod, (activityData) => {
      setActivityData(activityData);
      setNumberOfReadingSessions(0);
      activityData.forEach((day) => {
        console.log(
          "Adding " +
            day.reading_sessions.length +
            " to " +
            numberOfReadingSessions
        );
        setNumberOfReadingSessions(
          (prev) => prev + day.reading_sessions.length
        );
      });
    });
    // eslint-disable-next-line
  }, [forceUpdate]);

  const customText =
    studentInfo.name +
    " has read " +
    numberOfReadingSessions +
    " texts in the last ";
  return (
    <Fragment>
      <TimeSelector setForceUpdate={setForceUpdate} customText={customText} />
      <ReadingInsightHeader/>
      <ReadingInsightAccordion
      title="Shortened article title for article. - Approximately eighty characters long."
      length="123"
      difficulty="3.4"
      readingTime="17"
      translatedWordsList={["honey", "bee"]}/>
    </Fragment>
  );
}
