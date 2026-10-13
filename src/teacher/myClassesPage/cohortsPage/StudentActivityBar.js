import React, { useEffect, useState } from "react";
import { convertTime, timeExplanation } from "../../sharedComponents/FormattedTime";
import * as s from "../../styledComponents/StudentActivityBar.sc";
import { StyledTooltip } from "../../styledComponents/StyledTooltip.sc";

// A student's time in the period, one coloured segment per kind of activity
// (reading, exercises, browsing, listening: the colours of History's bars),
// as long as the student's total relative to the class's most active student.
const StudentActivityBar = ({ student, isFirst }) => {
  const [totalTimeString, setTotalTimeString] = useState("");

  useEffect(() => {
    convertTime(student.total_time, setTotalTimeString);
  }, [student]);

  if (student.total_time === 0) {
    return null;
  }

  return (
    <s.StudentActivityBar isFirst={isFirst}>
      <StyledTooltip label={timeExplanation(student)}>
        <div>
          <div className="activity-bar" style={{ width: student.normalized_activity_proportion + "%" }}>
            {student.activity_segments.map((segment) => (
              <s.Segment key={segment.kind} $kind={segment.kind} style={{ width: segment.percent + "%" }} />
            ))}
          </div>
          <p className="activtybar-hours-minutes">{totalTimeString}</p>
        </div>
      </StyledTooltip>
    </s.StudentActivityBar>
  );
};
export default StudentActivityBar;
