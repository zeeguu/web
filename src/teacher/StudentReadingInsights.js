import React, { Fragment, useEffect, useState } from "react";
import TimeSelector from "./TimeSelector";
import LocalStorage from "../assorted/LocalStorage";
import { useParams } from "react-router-dom";
import ReadingInsightHeader from "./ReadingInsightHeader";
import ReadingInsightAccordion from "./ReadingInsightAccordion";
import { CenteredContent } from "../components/ColumnWidth.sc";

export default function StudentReadingInsights({ api }) {
  const [forceUpdate, setForceUpdate] = useState(0);
  const selectedTimePeriod = LocalStorage.selectedTimePeriod();
  const studentID = useParams().studentID;
  const cohortID = useParams().cohortID;
  const [studentInfo, setStudentInfo] = useState({});
  const [cohortLang, setCohortLang] = useState("");
  const [readArticles, setReadArticles] = useState([]);

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

  useEffect(() => {
    api.getCohortsInfo((cohortInfo) => {
      let currentCohort = cohortInfo.filter((each) => each.id === cohortID);
      setCohortLang(currentCohort[0].language_name);
    });
    // eslint-disable-next-line
  }, [])

  const customText =
    readArticles &&
    studentInfo.name +
    " has read " +
    readArticles.length +
    " texts in the last ";
  
  return (
    <Fragment>
      <TimeSelector setForceUpdate={setForceUpdate} customText={customText} />
      {readArticles.length === 0 ? <CenteredContent> <h3> The student hasn't read any articles in {cohortLang} </h3></CenteredContent> :
        <div>
          <ReadingInsightHeader />
          <ReadingInsightAccordion readArticles={readArticles} />
        </div>}
    </Fragment>
  );
}
