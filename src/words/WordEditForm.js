import * as s from "./WordEdit.sc";
import * as st from "../exercises/bottomActions/FeedbackButtons.sc";
import { StyledGreyButton } from "../exercises/exerciseTypes/Exercise.sc";
import strings from "../i18n/definitions";
import { useState, useContext } from "react";
import { MAX_WORDS_IN_BOOKMARK_FOR_EXERCISES } from "../exercises/ExerciseConstants";
import isBookmarkExpression from "../utils/misc/isBookmarkExpression";
import FullWidthErrorMsg from "../components/FullWidthErrorMsg.sc";
import ReplaceExampleModal from "../exercises/replaceExample/ReplaceExampleModal";
import RemoveBookmarkModal from "../exercises/removeBookmark/RemoveBookmarkModal";

import { APIContext } from "../contexts/APIContext";

// `headline`, `isWordEditable`, `showExampleField` and `showRemoveFromExercises`
// let a call site trim the form down to what makes sense there. The defaults
// are the full form as shown in the words list and in exercises. The reader's
// alter menu opens a translation-only version: the word itself is anchored to
// article token coordinates, so rewriting it there would re-anchor the
// bookmark while the underlined token on the page stayed put.
export default function WordEditForm({
  bookmark,
  errorMessage,
  handleClose,
  updateBookmark,
  deleteAction,
  onWordRemovedFromExercises,
  headline,
  isWordEditable = true,
  showExampleField = true,
  showRemoveFromExercises = true,
}) {
  const api = useContext(APIContext);
  const [translation, setTranslation] = useState(bookmark.to);
  const [expression, setExpression] = useState(bookmark.from);
  const [context, setContext] = useState(bookmark.context);
  const [fitForStudy, setFitForStudy] = useState(bookmark.fit_for_study);
  const [showExcludeModal, setShowExcludeModal] = useState(false);

  // Handle user feedback for removing word from exercises
  const handleUserFeedback = (reason, bookmarkId) => {
    // Log the reason for removal
    api.logUserActivity(
      api.USER_SET_NOT_WORD_PREFERED,
      bookmark.article_id,
      bookmark.from,
      `WORD_EDIT_FORM_REMOVE: ${reason}`
    );
    
    // Remove from exercises (pass reason so backend can mark as learned if appropriate)
    api.userSetNotForExercises(bookmarkId, reason);
    
    // Update local state
    bookmark.fit_for_study = false;
    setFitForStudy(false);
    
    // Notify parent if in exercise context
    if (onWordRemovedFromExercises) {
      onWordRemovedFromExercises(reason, bookmarkId);
    }
  };

  const isNotEdited =
    bookmark.to === translation &&
    bookmark.from === expression &&
    bookmark.context === context;

  // A field only counts as required when this call site actually shows it;
  // otherwise a trimmed form could never submit over a field the user can't see.
  function hasEmptyRequiredField() {
    return (
      translation === "" ||
      (isWordEditable && expression === "") ||
      (showExampleField && context === "")
    );
  }

  function prepClose() {
    setTranslation(bookmark.to);
    setExpression(bookmark.from);
    setContext(bookmark.context);
    setFitForStudy(bookmark.fit_for_study);
  }


  function typingTranslation(event) {
    setTranslation(event.target.value);
  }

  function typingExpression(event) {
    setExpression(event.target.value);
  }

  function typingContext(event) {
    setContext(event.target.value);
  }

  function handleSubmit(event) {
    event.preventDefault();
    if (hasEmptyRequiredField()) {
      // Restore whatever the user emptied and don't submit.
      if (translation === "") setTranslation(bookmark.to);
      if (expression === "") setExpression(bookmark.from);
      if (context === "") setContext(bookmark.context);
    } else if (isNotEdited) {
      prepClose();
      handleClose();
    } else {
      updateBookmark(bookmark, expression, translation, context, bookmark.fit_for_study);
    }
  }

  const isExpression = isBookmarkExpression(bookmark);
  const defaultHeadline = isExpression ? strings.editExpression : "Edit Word and Example";
  const wordFieldLabel = isExpression ? strings.expression : strings.word;

  const wordField = isWordEditable ? (
    <s.ExampleFieldWrapper>
      <s.CustomTextField
        id="outlined-basic"
        label={wordFieldLabel}
        variant="outlined"
        fullWidth
        value={expression}
        onChange={typingExpression}
      />
    </s.ExampleFieldWrapper>
  ) : (
    <s.ReadOnlyWord>{expression}</s.ReadOnlyWord>
  );

  const exampleField = (
    <s.ExampleFieldWrapper>
      <s.CustomTextField
        id="outlined-basic"
        label="Preferred Example"
        variant="outlined"
        fullWidth
        multiline
        value={context}
        onChange={typingContext}
      />
      <s.FloatingButton>
        <ReplaceExampleModal
          exerciseBookmark={bookmark}
          onExampleUpdated={({ updatedBookmark }) => {
            setContext(updatedBookmark.context);
          }}
          renderAs="button"
          label="Change"
        />
      </s.FloatingButton>
    </s.ExampleFieldWrapper>
  );

  const canBeRemovedFromExercises =
    showRemoveFromExercises && bookmark.from.split(" ").length < MAX_WORDS_IN_BOOKMARK_FOR_EXERCISES;

  const actionButtons = isNotEdited ? (
    <div style={{ display: "flex", justifyContent: "flex-end" }}>
      <st.FeedbackSubmit type="submit" value={strings.done} style={{ marginTop: "1em" }} />
    </div>
  ) : (
    <div style={{ display: "flex", gap: "1em", justifyContent: "flex-end" }} className="save-cancel-buttons">
      <st.FeedbackCancel type="button" onClick={prepClose} value={strings.cancel} style={{ marginTop: "1em" }} />
      <st.FeedbackSubmit type="submit" value={strings.save} style={{ marginTop: "1em" }} />
    </div>
  );

  return (
    <>
      <s.Headline>{headline || defaultHeadline}</s.Headline>
      <form onSubmit={handleSubmit} autoFocus={true}>
        {errorMessage && <FullWidthErrorMsg>{errorMessage}</FullWidthErrorMsg>}

        {wordField}
        <s.CustomTextField
          id="outlined-basic"
          label={strings.translation}
          variant="outlined"
          fullWidth
          value={translation}
          onChange={typingTranslation}
        />

        {showExampleField && exampleField}

        <s.DoneButtonHolder>
          {canBeRemovedFromExercises && (
            <StyledGreyButton type="button" onClick={() => setShowExcludeModal(true)} style={{ marginTop: "1em" }}>
              Remove from exercises
            </StyledGreyButton>
          )}
          {actionButtons}
        </s.DoneButtonHolder>
      </form>
      {showRemoveFromExercises && (
        <RemoveBookmarkModal
          exerciseBookmarks={[bookmark]}
          open={showExcludeModal}
          setOpen={setShowExcludeModal}
          uploadUserFeedback={handleUserFeedback}
          setHasProvidedQuickFeedback={() => {
            setShowExcludeModal(false);
            handleClose();
          }}
        />
      )}
      {window.location.hostname === "localhost" && bookmark?.id && (
        <div style={{ marginTop: "1em", fontSize: "0.7em", color: "#999", textAlign: "right" }}>id: {bookmark.id}</div>
      )}
    </>
  );
}
