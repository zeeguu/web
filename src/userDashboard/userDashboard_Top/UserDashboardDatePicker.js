import { DATE_FORMAT_FOR_DATEPICKER } from "../ConstantsUserDashboard";
import * as s from "../userDashboard_Styled/UserDashboard.sc";
import DatePicker from "react-datepicker";

export default function UserDashboardDatePicker({
  referenceDate,
  handleChangeReferenceDate,
}) {
  return (
    <>
      {" "}
      <s.UserDatePicker>
        <DatePicker
          dateFormat={DATE_FORMAT_FOR_DATEPICKER}
          selected={referenceDate}
          onChange={(date) => handleChangeReferenceDate(date)}
        />
      </s.UserDatePicker>
    </>
  );
}
