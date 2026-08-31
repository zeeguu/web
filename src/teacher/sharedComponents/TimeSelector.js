import React, { useState } from "react";
import strings from "../../i18n/definitions";
import { timePeriodMap } from "./TimeSelectorHelperMap";
import { StyledButton } from "../styledComponents/TeacherButtons.sc";
import SelectButton from "./SelectButton";
import { StyledDialog } from "../styledComponents/StyledDialog.sc";
import { MdHighlightOff } from "react-icons/md";
import * as s from "../../components/ColumnWidth.sc";
import * as sc from "../styledComponents/TimeSelector.sc";
import LocalStorage from "../../assorted/LocalStorage";

// Days, in the order they are offered. timePeriodMap holds each one's label.
const TIME_PERIODS = [7, 14, 30, 182, 365];

const TimeSelector = ({ setForceUpdate, customText }) => {
  const [showTimesToChoose, setShowTimesToChoose] = useState(false);
  const selectedTimePeriod = LocalStorage.selectedTimePeriod();
  const isChosen = (time) => selectedTimePeriod === "" + time;

  const handleChange = (time) => {
    LocalStorage.setSelectedTimePeriod(time);
    setForceUpdate((prev) => prev + 1);
    // The page behind reloads with the new period, and the teacher asked one
    // question: leaving the dialog up hid the answer to it.
    setShowTimesToChoose(false);
  };

  return (
    <s.CenteredContent>
      <sc.TimeSelector>
        {customText}
        <StyledButton link onClick={() => setShowTimesToChoose(true)}>
          {timePeriodMap[selectedTimePeriod]}
        </StyledButton>
      </sc.TimeSelector>
      {showTimesToChoose && (
        <StyledDialog
          aria-label="Choose a time period."
          onDismiss={() => setShowTimesToChoose(false)}
          max_width="525px"
        >
          <StyledButton
            icon
            onClick={() => setShowTimesToChoose(false)}
            style={{ float: "right" }}
          >
            <MdHighlightOff size={35} />
          </StyledButton>
          <div className="centered">
            <p className="change-time"> {strings.changeTimePeriod} </p>
          </div>
          <div className="centered" id="row">
            {TIME_PERIODS.map((days) => (
              <SelectButton
                key={days}
                keyID={timePeriodMap[days]}
                btnText={timePeriodMap[days]}
                value={days}
                isChosen={isChosen(days)}
                handleChange={handleChange}
              />
            ))}
          </div>
        </StyledDialog>
      )}
    </s.CenteredContent>
  );
};
export default TimeSelector;
