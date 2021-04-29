import { DATE_FORMAT_FOR_DATEPICKER } from "../dataFormat/ConstantsUserDashboard";
import { UserDatePicker } from "../UserDashboard.sc";
import DatePicker from "react-datepicker";

export default function UserDashboardDatePicker({
  referenceDate,
  setReferenceDate,
}) {
  return (
    <>
      {" "}
      <UserDatePicker>
        <DatePicker
          dateFormat={DATE_FORMAT_FOR_DATEPICKER}
          selected={referenceDate}
          onChange={(date) => setReferenceDate(date)}
        />
      </UserDatePicker>
    </>
  );
}
