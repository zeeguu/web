import * as s from "./FeedbackButtons.sc.js";
import { useState, useEffect } from "react";
import strings from "../i18n/definitions";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";
import Tooltip from "@material-ui/core/Tooltip";

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

export default function FeedbackButtons({
  show,
  setShow,
  feedbackFunction,
  currentExerciseType,
  currentBookmarksToStudy,
}) {
  const MATCH_EXERCISE_TYPE = "Match_three_L1W_to_three_L2W";
  const THUMBS_DOWN_VALUE = "dislike_bookmark";

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
    {
      name: strings.other,
      value: "other",
      tooltip: strings.otherTooltip,
    },
  ];

  if (currentExerciseType !== MATCH_EXERCISE_TYPE) {
    buttons.splice(2, 0, {
      name: strings.badContext,
      value: "not_a_good_context",
      tooltip: strings.badContextTooltip,
    });
  }

  const [showInput, setShowInput] = useState(false);
  const [className, setClassName] = useState("");
  const [input, setInput] = useState("");
  const [selectedId, setSelectedId] = useState(null);
  const [feedback, setFeedback] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [userFeedback, setUserFeedback] = useState();

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
      if (value !== "other") {
        setUserFeedback(value);
        buttons.forEach((button) => {
          if (button.value === value) {
            setFeedback(
              `${strings.sentFeedback1} "${button.name}" ${strings.sentFeedback2}`
            );
          } else if (value === THUMBS_DOWN_VALUE) {
            setFeedback(
              `${strings.sentFeedback1} "${strings.dislike}" ${strings.sentFeedback2}`
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
      setUserFeedback(newFeedback);
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

  function stopSendingFeedback() {
    setOpenSnackbar(false);
  }

  const handleSnackbarClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    feedbackFunction(userFeedback, selectedId);
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
          <Tooltip title={strings.dislikeTooltip}>
            <s.FeedbackButton
              key="dislike"
              onClick={() => buttonClick(THUMBS_DOWN_VALUE)}
            >
              <img
                src="/static/images/thumb_down_black_18dp.svg"
                alt={strings.dislike}
                width={18}
              />
            </s.FeedbackButton>
          </Tooltip>
          {buttons.map((each) =>
            each.value === "other" ? (
              <Tooltip title={each.tooltip}>
                <s.FeedbackButton
                  key={each.value}
                  className={className}
                  onClick={() => buttonClick(each.value)}
                >
                  {each.name}
                </s.FeedbackButton>
              </Tooltip>
            ) : (
              <Tooltip title={each.tooltip}>
                <s.FeedbackButton
                  key={each.value}
                  onClick={() => buttonClick(each.value)}
                >
                  {each.name}
                </s.FeedbackButton>
              </Tooltip>
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
          {feedback}{" "}
          <s.UndoButton type="button" onClick={stopSendingFeedback}>
            {strings.undo}
          </s.UndoButton>
        </Alert>
      </Snackbar>
    </s.FeedbackHolder>
  );
}
