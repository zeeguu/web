import { useEffect, useState } from "react";
import { useClickOutside } from "react-click-outside-hook";
import { zeeguuDarkOrange } from "../components/colors";

export default function AlterMenu({
  word,
  isClickOutsideWordSpan,
  clickedOutsideAlterMenu,
  selectAlternative,
}) {
  const [refToAlterMenu, hasClickedOutside] = useClickOutside();
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    if (hasClickedOutside && isClickOutsideWordSpan) {
      clickedOutsideAlterMenu();
    }
  }, [hasClickedOutside, clickedOutsideAlterMenu]);

  function handleKeyDown(e) {
    if (e.code === "Enter") {
      selectAlternative(inputValue, "User Suggested");
    }
  }

  function shortenSource(word) {
    if (word.source === "Microsoft - without context") {
      return "Microsoft translate";
    }
    if (word.source === "Microsoft - with context") {
      return "contextual Microsoft translate";
    }

    if (word.source === "Google - without context") {
      return "Google translate";
    }
    if (word.source === "Google - with context") {
      return "contextual Google translate";
    }

    return word.source;
  }

  return (
    <div ref={refToAlterMenu} className="altermenu">
      {word.alternatives.map((each) => (
        <div
          key={each.translation}
          onClick={(e) => selectAlternative(each.translation, shortenSource(each))}
          className="additionalTrans"
        >
          {each.translation}
          <div style={{ fontSize: 9, color: zeeguuDarkOrange}}>
            {shortenSource(each)}
          </div>
        </div>
      ))}

      <input
        className="searchTextfieldInput matchWidth"
        type="text"
        id="#userAlternative"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={(e) => handleKeyDown(e)}
        placeholder="Own translation..."
      />
    </div>
  );
}
