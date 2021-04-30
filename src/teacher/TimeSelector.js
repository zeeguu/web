import React, { useState } from "react";
import { StyledButton } from "./TeacherButtons.sc";
import * as s from "../components/ColumnWidth.sc";
import * as sc from "./TimeSelector.sc";
import { StyledDialog } from "./StyledDialog.sc";
import { MdHighlightOff } from "react-icons/md";

const TimeSelector = ({ chosenTimePeriod, setShowChosenTimePeriod }) => {
  const [showTimesToChoose, setShowTimesToChoose] = useState(false);
  return (
    <s.CenteredContent>
      <sc.TimeSelector>
        This is the overview of the students activities for the{" "}
        <StyledButton link onClick={() => setShowTimesToChoose(true)}>
          {chosenTimePeriod}
        </StyledButton>
      </sc.TimeSelector>
      {showTimesToChoose && (
        <StyledDialog
          aria-label="Add a text from a url address."
          onDismiss={() => setShowTimesToChoose(false)}
          max_width="525px"
          margin="13em 0 0 35vw"
        >
          <StyledButton icon onClick={() => setShowTimesToChoose(false)} style={{float:"right"}}>
            <MdHighlightOff size={35} />
          </StyledButton>
          <div className="centered">
            <p className="change-time"> Change the time period</p>
          </div>
          <div className="centered" id="row">
            <StyledButton secondary>1 week</StyledButton>
            <StyledButton secondary>2 weeks</StyledButton>
            <StyledButton secondary>1 month</StyledButton>
            <StyledButton secondary>6 months</StyledButton>
            <StyledButton secondary>1 year</StyledButton>
          </div>
        </StyledDialog>
      )}
    </s.CenteredContent>
  );
};
export default TimeSelector;
