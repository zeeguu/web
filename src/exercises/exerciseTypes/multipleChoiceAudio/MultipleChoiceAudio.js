import { useState, useEffect, useContext } from "react";
import * as s from "../Exercise.sc.js";
import SpeakButton from "../SpeakButton.js";
import strings from "../../../i18n/definitions.js";
import LoadingAnimation from "../../../components/LoadingAnimation.js";
import InteractiveText from "../../../reader/InteractiveText.js";
import shuffle from "../../../assorted/fisherYatesShuffle.js";
import { removePunctuation } from "../../../utils/text/preprocessing.js";
import { TranslatableText } from "../../../reader/TranslatableText.js";
import AudioTwoBotInput from "./MultipleChoiceAudioBottomInput.js";
import { EXERCISE_TYPES } from "../../ExerciseTypeConstants.js";
import SessionStorage from "../../../assorted/SessionStorage.js";
import { SpeechContext } from "../../../contexts/SpeechContext.js";
import BookmarkProgressBar from "../../progressBars/BookmarkProgressBar.js";
import { APIContext } from "../../../contexts/APIContext.js";

// The user has to select the correct spoken L2 translation of a given L1 word out of three.
// This tests the user's active knowledge.

const EXERCISE_TYPE = EXERCISE_TYPES.multipleChoiceAudio;

export default function MultipleChoiceAudio({
  bookmarksToStudy,
  exerciseMessageToAPI,
  notifyCorrectAnswer,
  notifyIncorrectAnswer,
  setExerciseType,
  isExerciseOver,
  resetSubSessionTimer,
  handleDisabledAudio,
  reload,
}) {
  const api = useContext(APIContext);
  const [interactiveText, setInteractiveText] = useState();
  const [choiceOptions, setChoiceOptions] = useState(null);
  const [currentChoice, setCurrentChoice] = useState("");
  const [selectedButtonId, setSelectedButtonId] = useState("");
  const exerciseBookmark = bookmarksToStudy[0];
  const speech = useContext(SpeechContext);

  useEffect(() => {
    resetSubSessionTimer();
    setExerciseType(EXERCISE_TYPE);
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    setInteractiveText(
      new InteractiveText(
        exerciseBookmark.context_tokenized,
        exerciseBookmark.article_id,
        exerciseBookmark.context_in_content,
        api,
        [],
        "TRANSLATE WORDS IN EXERCISE",
        exerciseBookmark.from_lang,
        EXERCISE_TYPE,
        speech,
      ),
    );
    consolidateChoice();
    if (!SessionStorage.isAudioExercisesEnabled()) handleDisabledAudio();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reload, exerciseBookmark]);

  function consolidateChoice() {
    // Index 0 is the correct bookmark and index 1 and 2 are incorrect
    let listOfchoices = [0, 1, 2];
    let shuffledListOfChoices = shuffle(listOfchoices);
    setChoiceOptions(shuffledListOfChoices);
  }

  if (!interactiveText || !choiceOptions) {
    return <LoadingAnimation />;
  }

  const selectedButtonStyle = (id) => {
    if (selectedButtonId === id) {
      return "selected";
    }
    return null;
  };

  function handleClick(id) {
    setSelectedButtonId(id);
  }

  return (
    <s.Exercise>
      <div className="headlineWithMoreSpace">
        {strings.multipleChoiceAudioHeadline}
      </div>
      <BookmarkProgressBar
        bookmark={exerciseBookmark}
        message={exerciseMessageToAPI}
      />
      {isExerciseOver && (
        <>
          <br></br>
          <h1 className="wordInContextHeadline">
            {removePunctuation(exerciseBookmark.to)}
          </h1>
        </>
      )}

      <div className="contextExample">
        <TranslatableText
          isExerciseOver={isExerciseOver}
          interactiveText={interactiveText}
          translating={true}
          pronouncing={false}
          bookmarkToStudy={exerciseBookmark.from}
          leftEllipsis={exerciseBookmark.left_ellipsis}
          rightEllipsis={exerciseBookmark.right_ellipsis}
        />
      </div>

      {!isExerciseOver && (
        <s.CenteredRow>
          {/* Mapping bookmarks to the buttons in random order, setting button properties based on bookmark index */}
          {choiceOptions &&
            choiceOptions.map((option) => (
              <SpeakButton
                onClick={(e) => {
                  setCurrentChoice(option);
                  handleClick(option);
                }}
                isSelected={option === currentChoice}
                bookmarkToStudy={bookmarksToStudy[option]}
                api={api}
                id={option.id}
                styling={selectedButtonStyle(option)}
              />
            ))}
        </s.CenteredRow>
      )}

      {!isExerciseOver && (
        <AudioTwoBotInput
          bookmarksToStudy={bookmarksToStudy}
          currentChoice={currentChoice}
          notifyCorrectAnswer={notifyCorrectAnswer}
          notifyIncorrectAnswer={notifyIncorrectAnswer}
        />
      )}
    </s.Exercise>
  );
}
