import * as s from "./FeedbackButtons.sc.js";
import { useState, useEffect, createRef } from "react";
import strings from "../../i18n/definitions";
import Tooltip from "@material-ui/core/Tooltip";
import { EXERCISE_TYPES } from "../ExerciseTypeConstants.js";

export default function FeedbackButtons({
  show,
  setShow,
  currentExerciseType,
  currentBookmarksToStudy,
  selectedId,
  setSelectedId,
  callFeedbackFunctionAndNotify,
}) {
  const buttons = [
    {
      name: strings.bookmarkTooEasy,
      value: "too_easy",
      tooltip: strings.bookmarkTooEasyTooltip,
    },
    {
      name: strings.badContext,
      value: "bad_context",
      tooltip: strings.badContextTooltip,
    },
  ];

  const [showInput, setShowInput] = useState(false);
  const [className, setClassName] = useState("");
  const [input, setInput] = useState("");
  const wrapper = createRef();

  useEffect(() => {
    setInput("");
    setClassName("");
    setShowInput(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentExerciseType]);

  function buttonClick(value) {
    let feedbackString = "";
    if (!selectedId) {
      alert(strings.selectWordsAlert);
    } else {
      if (value !== "other") {
        buttons.forEach((button) => {
          if (button.value === value) {
            feedbackString = `${strings.sentFeedback1} "${button.name}" ${strings.sentFeedback2}`;
          }
        });
        callFeedbackFunctionAndNotify(feedbackString, value);
        setShow(false);
        if (currentExerciseType === EXERCISE_TYPES.match) {
          setSelectedId(null);
        }
      } else {
        setClassName("selected");
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
      let feedbackString = `${strings.sentFeedback1} "${input}" ${strings.sentFeedback2}`;
      setInput("");
      setShowInput(false);
      setClassName("");
      if (currentExerciseType === EXERCISE_TYPES.match) {
        setSelectedId(null);
      }
      callFeedbackFunctionAndNotify(feedbackString, newFeedback);
      setShow(false);
      event.preventDefault();
    }
  }

  return (
    <s.FeedbackButtonsHolder>
      {show && currentExerciseType === EXERCISE_TYPES.match && (
        <>
          <s.FeedbackInstruction>{strings.selectWords}</s.FeedbackInstruction>
          <s.FeedbackSelector>
            {currentBookmarksToStudy.map((bookmark) => (
              <s.FeedbackLabel key={bookmark.id}>
                <input
                  key={"radio_" + bookmark.id}
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
        <>
          {buttons.map((each) =>
            each.value === "other" ? (
              <Tooltip
                ref={wrapper}
                key={"tooltip_" + each.value}
                title={<p style={{ fontSize: "small" }}>{each.tooltip}</p>}
              >
                <s.FeedbackButton
                  key={each.value}
                  className={className}
                  onClick={() => buttonClick(each.value)}
                >
                  {each.name}
                </s.FeedbackButton>
              </Tooltip>
            ) : (
              <Tooltip
                ref={wrapper}
                key={"tooltip_" + each.value}
                title={<p style={{ fontSize: "small" }}>{each.tooltip}</p>}
              >
                <s.FeedbackButton
                  key={each.value}
                  onClick={() => buttonClick(each.value)}
                >
                  {each.name}
                </s.FeedbackButton>
              </Tooltip>
            ),
          )}
        </>
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
    </s.FeedbackButtonsHolder>
  );
}
