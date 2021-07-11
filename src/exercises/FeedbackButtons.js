import * as s from "./FeedbackButtons.sc.js";
import { useState, useEffect } from "react";
import strings from "../i18n/definitions";

export default function FeedbackButtons({
  show,
  feedbackFunction,
  currentExerciseType,
  currentBookmarksToStudy,
}) {
  const matchExerciseType = "Match_three_L1W_to_three_L2W";

  const buttons = [
    { name: "Too Easy", value: "too_easy" },
    { name: "Too Hard", value: "too_hard" },
    { name: "Bad Translation", value: "bad_translation" },
    { name: "Other", value: "other" },
  ];

  if (currentExerciseType !== matchExerciseType) {
    buttons.splice(3, 0, { name: "Bad Context", value: "not_a_good_context" });
  }
  const [showInput, setShowInput] = useState(false);
  const [className, setClassName] = useState("");
  const [input, setInput] = useState("");
  const [selectedId, setSelectedId] = useState();

  useEffect(() => {
    if (currentExerciseType !== matchExerciseType) {
      setSelectedId(currentBookmarksToStudy[0].id);
    }
    console.log(selectedId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function buttonClick(value) {
    if (!selectedId) {
      alert(strings.selectWordsAlert);
    } else {
      if (value !== "other") {
        feedbackFunction(value, selectedId);
      } else {
        setClassName("selected");
        setShowInput(true);
      }
    }
  }

  function handleTyping(event) {
    setInput(event.target.value);
  }

  function handleSelection(event) {
    setSelectedId(Number(event.target.value));
  }

  function handleSubmit(event) {
    if (input === "") {
      alert(strings.giveFeedbackAlert);
      event.preventDefault();
    } else {
      let re1 = /[.,'´`?!:;]/g;
      let re2 = /\s{2,}/g;
      const newFeedback = input
        .toLowerCase()
        .trim()
        .replace(re1, "")
        .replace(re2, "")
        .replaceAll(" ", "_");
      feedbackFunction(newFeedback, selectedId);
      setInput("");
      event.preventDefault();
    }
  }

  return (
    <s.FeedbackHolder>
      {show && currentExerciseType === matchExerciseType && (
        <>
          <s.FeedbackInstruction>{strings.selectWords}</s.FeedbackInstruction>
          <s.FeedbackSelector>
            {currentBookmarksToStudy.map((bookmark) => (
              <s.FeedbackLabel key={bookmark.id}>
                <input
                  type="radio"
                  value={bookmark.id}
                  checked={Number(selectedId) === bookmark.id}
                  onChange={handleSelection}
                />
                {bookmark.from}
              </s.FeedbackLabel>
            ))}
          </s.FeedbackSelector>
        </>
      )}
      {show && (
        <s.FeedbackButtonsHolder>
          {buttons.map((each) =>
            each.value === "other" ? (
              <s.FeedbackButton
                key={each.value}
                className={className}
                onClick={() => buttonClick(each.value)}
              >
                {each.name}
              </s.FeedbackButton>
            ) : (
              <s.FeedbackButton
                key={each.value}
                onClick={() => buttonClick(each.value)}
              >
                {each.name}
              </s.FeedbackButton>
            )
          )}
        </s.FeedbackButtonsHolder>
      )}
      {show && showInput && (
        <s.FeedbackForm onSubmit={handleSubmit}>
          <s.FeedbackLabel>
            {strings.otherFeedback}
            <s.FeedbackInput
              type="text"
              value={input}
              onChange={handleTyping}
            />
          </s.FeedbackLabel>
          <s.FeedbackSubmit type="submit" value="Submit" />
        </s.FeedbackForm>
      )}
    </s.FeedbackHolder>
  );
}
