import React, { useState } from "react";
import { timePeriodMap } from "./TimeSelectorHelperMap";
import { StyledButton } from "./TeacherButtons.sc";
import SelectButton from "./SelectButton";
import { StyledDialog } from "./StyledDialog.sc";
import { MdHighlightOff } from "react-icons/md";
import * as s from "../components/ColumnWidth.sc";
import * as sc from "./TimeSelector.sc";

const TimeSelector = ({ chosenTimePeriod, setChosenTimePeriod }) => {
  const [showTimesToChoose, setShowTimesToChoose] = useState(false);

  const isChosen = (time) => chosenTimePeriod === time;

  return (
    <s.CenteredContent>
      <sc.TimeSelector>
        <p>
          This is the overview of the students' activities for the last
          <StyledButton link onClick={() => setShowTimesToChoose(true)}>
            {timePeriodMap[chosenTimePeriod]}
          </StyledButton>
          STRINGS
        </p>
      </sc.TimeSelector>
      {showTimesToChoose && (
        <StyledDialog
          aria-label="Choose a time period."
          onDismiss={() => setShowTimesToChoose(false)}
          max_width="525px"
          margin="13em 0 0 35vw"
        >
          <StyledButton
            icon
            onClick={() => setShowTimesToChoose(false)}
            style={{ float: "right" }}
          >
            <MdHighlightOff size={35} />
          </StyledButton>
          <div className="centered">
            <p className="change-time"> Change the time period STRINGS</p>
          </div>
          <div className="centered" id="row">
            <SelectButton
              key={timePeriodMap[7]}
              btnText={timePeriodMap[7]}
              value={7}
              isChosen={isChosen(7)}
              handleChange={setChosenTimePeriod}
            />
            <SelectButton
              key={timePeriodMap[14]}
              btnText={timePeriodMap[14]}
              value={14}
              isChosen={isChosen(14)}
              handleChange={setChosenTimePeriod}
            />
            <SelectButton
              key={timePeriodMap[30]}
              btnText={timePeriodMap[30]}
              value={30}
              isChosen={isChosen(30)}
              handleChange={setChosenTimePeriod}
            />
            <SelectButton
              key={timePeriodMap[182]}
              btnText={timePeriodMap[182]}
              value={182}
              isChosen={isChosen(182)}
              handleChange={setChosenTimePeriod}
            />
            <SelectButton
              key={timePeriodMap[365]}
              btnText={timePeriodMap[365]}
              value={365}
              isChosen={isChosen(365)}
              handleChange={setChosenTimePeriod}
            />
          </div>
        </StyledDialog>
      )}
    </s.CenteredContent>
  );
};
export default TimeSelector;
