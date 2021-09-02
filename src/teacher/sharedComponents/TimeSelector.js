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

const TimeSelector = ({ setForceUpdate, customText }) => {
  const [showTimesToChoose, setShowTimesToChoose] = useState(false);
  const selectedTimePeriod = LocalStorage.selectedTimePeriod();
  const isChosen = (time) => selectedTimePeriod === "" + time;

  const handleChange = (time) => {
    LocalStorage.setSelectedTimePeriod(time);
    setForceUpdate((prev) => prev + 1);
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
            <p className="change-time"> {strings.changeTimePeriod} </p>
          </div>
          <div className="centered" id="row">
            <SelectButton
              keyID={timePeriodMap[7]}
              btnText={timePeriodMap[7]}
              value={7}
              isChosen={isChosen(7)}
              handleChange={(time) => handleChange(time)}
            />
            <SelectButton
              keyID={timePeriodMap[14]}
              btnText={timePeriodMap[14]}
              value={14}
              isChosen={isChosen(14)}
              handleChange={(time) => handleChange(time)}
            />
            <SelectButton
              keyID={timePeriodMap[30]}
              btnText={timePeriodMap[30]}
              value={30}
              isChosen={isChosen(30)}
              handleChange={(time) => handleChange(time)}
            />
            <SelectButton
              keyID={timePeriodMap[182]}
              btnText={timePeriodMap[182]}
              value={182}
              isChosen={isChosen(182)}
              handleChange={(time) => handleChange(time)}
            />
            <SelectButton
              keyID={timePeriodMap[365]}
              btnText={timePeriodMap[365]}
              value={365}
              isChosen={isChosen(365)}
              handleChange={(time) => handleChange(time)}
            />
          </div>
        </StyledDialog>
      )}
    </s.CenteredContent>
  );
};
export default TimeSelector;
