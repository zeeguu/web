import * as s from "./FeedbackButtons.sc.js";
import { useState, useEffect } from "react";
import strings from "../i18n/definitions";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

export default function FeedbackButtons({
  show,
  setShow,
  feedbackFunction,
  currentExerciseType,
  currentBookmarksToStudy,
  adjustCurrentTranslation,
}) {
  const MATCH_EXERCISE_TYPE = "Match_three_L1W_to_three_L2W";

  const buttons = [
    { name: strings.bookmarkTooEasy, value: "too_easy" },
    { name: strings.bookmarkTooHard, value: "too_hard" },
    { name: strings.badTranslation, value: "bad_translation" },
    { name: strings.adjustTranslation, value: "adjust_translation" },
    { name: strings.other, value: "other" },
  ];

  if (currentExerciseType !== MATCH_EXERCISE_TYPE) {
    buttons.splice(3, 0, {
      name: strings.badContext,
      value: "not_a_good_context",
    });
  }

  const [showInput, setShowInput] = useState(false);
  const [className, setClassName] = useState("");
  const [input, setInput] = useState("");
  const [selectedId, setSelectedId] = useState(null);
  const [feedback, setFeedback] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);

  useEffect(() => {
    if (currentExerciseType !== MATCH_EXERCISE_TYPE) {
      setSelectedId(currentBookmarksToStudy[0].id);
    } else {
      setSelectedId(null);
    }
    console.log(selectedId);
    setOpenSnackbar(false);
    setInput("");
    setShowInput(false);
    setClassName("");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentExerciseType]);

  function buttonClick(value) {
    if (!selectedId) {
      alert(strings.selectWordsAlert);
    } else {
      if (value !== "other" && value !== "adjust_translation") {
        feedbackFunction(value, selectedId);
        buttons.forEach((button) => {
          if (button.value === value)
            setFeedback(
              `${strings.sentFeedback1} "${button.name}" ${strings.sentFeedback2}`
            );
        });
        setOpenSnackbar(true);
        setShow(false);
        if (currentExerciseType === MATCH_EXERCISE_TYPE) {
          setSelectedId(null);
        }
      } else if (value === "other") {
        setClassName("selected");
        setShowInput(true);
      } else {
        if (currentExerciseType === MATCH_EXERCISE_TYPE) {
          let currentBookmark = currentBookmarksToStudy.filter(
            (bookmark) => bookmark.id === selectedId
          );
          console.log(currentBookmark[0]);
          adjustTranslationPrompt(currentBookmark[0]);
        } else {
          adjustTranslationPrompt(currentBookmarksToStudy[0]);
        }
      }
    }
  }

  function adjustTranslationPrompt(currentBookmark) {
    let newTranslation = prompt(
      strings.submitTranslation +
        ": " +
        currentBookmark.from +
        "\n" +
        "(" +
        strings.currently +
        ": " +
        currentBookmark.to +
        ")"
    );
    adjustCurrentTranslation(currentBookmark, newTranslation);
    setFeedback(
      `${strings.adjustTranslationFeedback1} "${currentBookmark.from}" ${strings.adjustTranslationFeedback2} "${newTranslation}"`
    );
    setOpenSnackbar(true);
    setShow(false);
    if (currentExerciseType === MATCH_EXERCISE_TYPE) {
      setSelectedId(null);
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
      setFeedback(
        `${strings.sentFeedback1} "${input}" ${strings.sentFeedback2}`
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

  const handleSnackbarClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpenSnackbar(false);
  };

  return (
    <s.FeedbackHolder>
      {show && currentExerciseType === MATCH_EXERCISE_TYPE && (
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
      <Snackbar
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        open={openSnackbar}
        autoHideDuration={4500}
        onClose={handleSnackbarClose}
      >
        <Alert onClose={handleSnackbarClose} severity="success">
          {feedback}
        </Alert>
      </Snackbar>
    </s.FeedbackHolder>
  );
}
