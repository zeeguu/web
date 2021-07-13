import * as s from "./FeedbackButtons.sc.js";
import { useState, useEffect } from "react";
import strings from "../i18n/definitions";
import { useSnackbar } from "react-simple-snackbar";

export default function FeedbackButtons({
  show,
  feedbackFunction,
  currentExerciseType,
  currentBookmarksToStudy,
}) {
  const matchExerciseType = "Match_three_L1W_to_three_L2W";

  const buttons = [
    { name: strings.bookmarkTooEasy, value: "too_easy" },
    { name: strings.bookmarkTooHard, value: "too_hard" },
    { name: strings.badTranslation, value: "bad_translation" },
    { name: strings.other, value: "other" },
  ];

  if (currentExerciseType !== matchExerciseType) {
    buttons.splice(3, 0, {
      name: strings.badContext,
      value: "not_a_good_context",
    });
  }

  const options = {
    position: "bottom-right",
    style: {
      backgroundColor: "#00665C",
      color: "#ffffff",
      textAlign: "center",
      minWidth: "fit-content",
      fontFamily: "",
    },
    closeStyle: {
      marginLeft: "-1em",
    },
  };

  const [showInput, setShowInput] = useState(false);
  const [className, setClassName] = useState("");
  const [input, setInput] = useState("");
  const [selectedId, setSelectedId] = useState(null);

  const [openSnackbar, closeSnackbar] = useSnackbar(options);

  useEffect(() => {
    if (currentExerciseType !== matchExerciseType) {
      setSelectedId(currentBookmarksToStudy[0].id);
    } else {
      setSelectedId(null);
    }
    console.log(selectedId);
    closeSnackbar();
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
        feedbackFunction(value, selectedId);
        let feedback = "";
        buttons.forEach((button) => {
          if (button.value === value) feedback = button.name;
        });
        openSnackbar(
          `${strings.sentFeedback1} "${feedback}" ${strings.sentFeedback2}`,
          4500
        );
        if (currentExerciseType === matchExerciseType) {
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
      feedbackFunction(newFeedback, selectedId);
      let feedback = input;
      setInput("");
      setShowInput(false);
      setClassName("");
      if (currentExerciseType === matchExerciseType) {
        setSelectedId(null);
      }
      openSnackbar(
        `${strings.sentFeedback1} "${feedback}" ${strings.sentFeedback2}`,
        4500
      );
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
