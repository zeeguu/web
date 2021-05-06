import React, { Fragment, useState } from "react";
import * as s from "../components/ColumnWidth.sc";
import TimeSelector from "./TimeSelector";
import LocalStorage from "../assorted/LocalStorage";
import { useParams } from "react-router-dom";
import {
  ExpansionPanel,
  ExpansionPanelDetails,
  ExpansionPanelSummary
} from "@material-ui/core";
import { MdExpandMore } from "react-icons/md/";

export default function StudentReadingInsights({ api }) {
  const [forceUpdate, setForceUpdate] = useState(0);
  const selectedTimePeriod = LocalStorage.selectedTimePeriod();
  const studentID = useParams().studentID;
  const cohortID = useParams().cohortID;

  console.log(studentID);
  console.log(cohortID);

  const customText = " 'student.name' has read '3' texts in the last ";

  return (
    <Fragment>
      <TimeSelector setForceUpdate={setForceUpdate} customText={customText} />
      <s.WidestColumn>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            width: "120%",
            marginLeft: "-10%"
          }}
        >
          <ExpansionPanel
            style={{
              marginTop: "40px",
              width: "120%"
            }}
          >
            <ExpansionPanelSummary expandIcon={<MdExpandMore />}>
              <div style={{ display: "flex", alignItems: "baseline" }}>
                <h2>"Article 1"</h2>
              </div>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails
              style={{
                display: "flex",
                flexDirection: "column"
              }}
            >
              <p>No words were translated in this reading session.</p>
            </ExpansionPanelDetails>
          </ExpansionPanel>
        </div>
      </s.WidestColumn>
    </Fragment>
  );
}
