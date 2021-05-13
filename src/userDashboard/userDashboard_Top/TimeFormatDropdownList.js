import { ACTIVITY_TIME_FORMAT_OPTIONS } from "../ConstantsUserDashboard";
import { DropDownList, DropDownOption } from "./DropDownList";

export default function TimeFormatDropdownList({
  activeTimeFormatOption,
  handleActiveTimeFormatChange,
}) {
  const customTimeFormatOptions = [
    { id: 1, title: ACTIVITY_TIME_FORMAT_OPTIONS.MINUTES },
    { id: 2, title: ACTIVITY_TIME_FORMAT_OPTIONS.HOURS },
  ];

  return (
    <DropDownList
      handleChange={handleActiveTimeFormatChange}
      stateValue={activeTimeFormatOption}
      isCustom={true}
    >
      {customTimeFormatOptions.map((option) => (
        <DropDownOption key={option.id} id={option.id} title={option.title} />
      ))}
    </DropDownList>
  );
}
