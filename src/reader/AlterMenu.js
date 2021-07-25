import { useEffect, useState } from "react";
import { useClickOutside } from "react-click-outside-hook";

export default function AlterMenu({
  word,
  clickedOutsideAlterMenu,
  selectAlternative,
}) {
  const [refToAlterMenu, hasClickedOutside] = useClickOutside();
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    if (hasClickedOutside) {
      clickedOutsideAlterMenu();
    }
  }, [hasClickedOutside, clickedOutsideAlterMenu]);

  function handleKeyDown(e) {
    if (e.code === "Enter") {
      selectAlternative(inputValue);
    }
  }

  function shortenSource(word) {
    if (word.source === "Microsoft - without context") {
      return "msft";
    }
    if (word.source === "Microsoft - with context") {
      return "contextual msft";
    }

    if (word.source === "Google - without context") {
      return "goog";
    }
    if (word.source === "Google - with context") {
      return "contextual goog";
    }

    return word.source;
  }

  return (
    <div ref={refToAlterMenu} className="altermenu">
      {word.alternatives.map((each) => (
        <div
          key={each.translation}
          onClick={(e) => selectAlternative(each.translation)}
          className="additionalTrans"
        >
          {each.translation}
          <div style={{ fontSize: 9, color: "#ffcc66" }}>
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
