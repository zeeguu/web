import PillSelector from "./PillSelector";

/**
 * The CEFR level as a row of pills. The pill shows only the band -- "B1" -- and
 * the line underneath spells out what that means, which is the part a learner
 * actually judges themselves against.
 */
export default function CefrLevelSelector({ levels, selectedValue, onChange, label, isError, errorMessage }) {
  const options = levels.map((level) => ({
    value: level.value,
    pillLabel: level.label.split(" | ")[0],
    hintLabel: level.label,
    hintDescription: level.description,
  }));

  return (
    <PillSelector
      options={options}
      selectedValue={selectedValue}
      onChange={onChange}
      label={label}
      isError={isError}
      errorMessage={errorMessage}
    />
  );
}
