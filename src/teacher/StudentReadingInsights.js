import React, { Fragment, useEffect, useState } from "react";
import TimeSelector from "./TimeSelector";
import LocalStorage from "../assorted/LocalStorage";
import { useParams } from "react-router-dom";
import {
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
} from "@reach/accordion";
import "@reach/accordion/styles.css";
import { MdExpandMore } from "react-icons/md/";
import ReadingInsightHeader from "./ReadingInsightHeader";

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
      <div
        style={{
          display: "flex",
          height: "13vh",
          marginBottom: "3vh",
          borderLeft: "solid 3px #4492b3",
          width: "100%",
        }}
      >
        <Accordion collapsible>
          <AccordionItem>
            <div style={{ display: "flex", marginLeft: "1vw"}}>
              <h2 style={{ fontWeight: "400"}}>
                Shortened article title for article. - Approximately eighty
                characters long.
              </h2>
              <div
                className="circle-wrapper"
                style={{
                  display: "flex",
                  width: "30em",
                  padding: ".5vw",
                  paddingLeft: "10%",
                  justifyContent: "center"
                }}
              >
                <div
                  style={{
                    marginRight: "1.5em",
                    lineHeight: "5em",
                    textAlign: "center",
                    fontSize: "medium",
                    width: "5em",
                    height: "5em",
                    backgroundColor: "#e5e5e5",
                    borderRadius: "2.5em",
                  }}
                >
                  123
                </div>
                <div
                  style={{
                    marginRight: "1.5em",
                    lineHeight: "5em",
                    textAlign: "center",
                    fontSize: "medium",
                    width: "5em",
                    height: "5em",
                    backgroundColor: "#e5e5e5",
                    borderRadius: "2.5em",
                  }}
                >
                  4.5
                </div>
                <div
                  style={{
                    marginRight: "1.5em",
                    lineHeight: "5em",
                    textAlign: "center",
                    fontSize: "medium",
                    width: "5em",
                    height: "5em",
                    backgroundColor: "#e5e5e5",
                    borderRadius: "2.5em",
                  }}
                >
                  10 min
                </div>
                <div
                  style={{
                    marginRight: "1.5em",
                    lineHeight: "5em",
                    textAlign: "center",
                    fontSize: "medium",
                    width: "5em",
                    height: "5em",
                    backgroundColor: "#e5e5e5",
                    borderRadius: "2.5em",
                  }}
                >
                  7
                </div>
              </div>
              <AccordionButton
                style={{
                  marginLeft: "-2em",
                  border: "None",
                  backgroundColor: "white",
                  alignContent: "center",
                }}
              >
                <p style={{ width: "4.5em", fontWeight: "600" }}>View more</p>
                <MdExpandMore
                  style={{ marginTop: "-.5em", fontSize: "45px", color:"#4492b3"}}
                />
              </AccordionButton>
            </div>
            <AccordionPanel
              style={{
                backgroundColor: "white",
                minWidth: "300px",
                maxWidth: "90%",
                marginLeft: "2%",
                marginTop: "1vh",
                boxShadow:
                  "0 4px 8px 0 rgba(0, 0, 0, 0.12), 0 2px 4px 0 rgba(0, 0, 0, 0.08)",
                borderRadius: "10px",
                padding:"1em",
              }}
            >
              <h2 style={{color: "#4492b3"}}>
                Translated words in the context of their sencences
              </h2>
              <p style={{textAlign: "center"}}>No words were translated in this reading session.</p>
            </AccordionPanel>
          </AccordionItem>
        </Accordion>
      </div>
    </Fragment>
  );
}
