import * as s from "./FeedbackButtons.sc.js";
import { useState, useEffect, createRef } from "react";
import strings from "../../i18n/definitions";
import Tooltip from "@material-ui/core/Tooltip";
import { APP_DOMAIN } from "../../i18n/appConstants.js";
import exerciseTypes from "../ExerciseTypeConstants.js";

export default function FeedbackButtons({
  show,
  setShow,
  currentExerciseType,
  currentBookmarksToStudy,
  selectedId,
  setSelectedId,
  setFeedback,
  setOpenSnackbar,
  setUserFeedback,
}) {
  const MATCH_EXERCISE_TYPE = exerciseTypes.match;

  const buttons = [
    {
      name: strings.bookmarkTooEasy,
      value: "too_easy",
      tooltip: strings.bookmarkTooEasyTooltip,
    },
    {
      name: strings.bookmarkTooHard,
      value: "too_hard",
      tooltip: strings.bookmarkTooHardTooltip,
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
    if (!selectedId) {
      alert(strings.selectWordsAlert);
    } else {
      if (value !== "other") {
        setUserFeedback(value);
        buttons.forEach((button) => {
          if (button.value === value) {
            setFeedback(
              `${strings.sentFeedback1} "${button.name}" ${strings.sentFeedback2}`,
            );
          }
        });
        setOpenSnackbar(true);
        setShow(false);
        if (currentExerciseType === MATCH_EXERCISE_TYPE) {
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
      setUserFeedback(newFeedback);
      setFeedback(
        `${strings.sentFeedback1} "${input}" ${strings.sentFeedback2}`,
      );
      setInput("");
      setShowInput(false);
      setClassName("");
      if (currentExerciseType === MATCH_EXERCISE_TYPE) {
        setSelectedId(null);
      }
      setOpenSnackbar(true);
      setShow(false);
      event.preventDefault();
    }
  }

  return (
    <>
      {show && currentExerciseType === MATCH_EXERCISE_TYPE && (
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
        <s.FeedbackButtonsHolder>
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
    </>
  );
}
