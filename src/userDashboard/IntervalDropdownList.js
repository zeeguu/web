import { OPTIONS } from "./dataFormat/ConstantsUserDashboard";

import { DropDownList, DropDownOption } from "./DropDownList";

export default function IntervalDropdownList({
  handleActiveTimeIntervalChange,
  activeTimeInterval,
}) {
  const options = [
    { id: 1, title: OPTIONS.WEEK },
    { id: 2, title: OPTIONS.MONTH },
    { id: 3, title: OPTIONS.YEAR },
    { id: 4, title: OPTIONS.YEARS },
    { id: 5, title: OPTIONS.CUSTOM },
  ];

  return (
    <DropDownList
      handleChange={handleActiveTimeIntervalChange}
      stateValue={activeTimeInterval}
    >
      {options.map((option) => (
        <DropDownOption key={option.id} id={option.id} title={option.title} />
      ))}
    </DropDownList>
  );
}
