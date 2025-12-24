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

export default function WordEditForm({
  bookmark,
  errorMessage,
  handleClose,
  updateBookmark,
  deleteAction,
  onWordRemovedFromExercises,
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
    if (translation === "" || expression === "" || context === "") {
      if (translation === "") {
        setTranslation(bookmark.to);
        event.preventDefault();
      }
      if (expression === "") {
        setExpression(bookmark.from);
        event.preventDefault();
      }
      if (context === "") {
        setContext(bookmark.context);
        event.preventDefault();
      }
    } else if (isNotEdited) {
      prepClose();
      handleClose();
    } else {
      updateBookmark(bookmark, expression, translation, context, bookmark.fit_for_study);
    }
  }

  return (
    <>
      {isBookmarkExpression(bookmark) ? (
        <s.Headline>{strings.editExpression}</s.Headline>
      ) : (
        <s.Headline>Edit Word and Example</s.Headline>
      )}
      <form onSubmit={handleSubmit} autoFocus={true}>
        {errorMessage && <FullWidthErrorMsg>{errorMessage}</FullWidthErrorMsg>}

        {isBookmarkExpression(bookmark) ? (
          <s.ExampleFieldWrapper>
            <s.CustomTextField
              id="outlined-basic"
              label={strings.expression}
              variant="outlined"
              fullWidth
              value={expression}
              onChange={typingExpression}
            />
          </s.ExampleFieldWrapper>
        ) : (
          <s.ExampleFieldWrapper>
            <s.CustomTextField
              id="outlined-basic"
              label={strings.word}
              variant="outlined"
              fullWidth
              value={expression}
              onChange={typingExpression}
            />
          </s.ExampleFieldWrapper>
        )}
        <s.CustomTextField
          id="outlined-basic"
          label={strings.translation}
          variant="outlined"
          fullWidth
          value={translation}
          onChange={typingTranslation}
        />


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

        <s.DoneButtonHolder>
          {bookmark.from.split(" ").length < MAX_WORDS_IN_BOOKMARK_FOR_EXERCISES && (
            <StyledGreyButton type="button" onClick={() => setShowExcludeModal(true)} style={{ marginTop: "1em" }}>
              Remove from exercises
            </StyledGreyButton>
          )}
          {isNotEdited ? (
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <st.FeedbackSubmit type="submit" value={strings.done} style={{ marginTop: "1em" }} />
            </div>
          ) : (
            <div style={{ display: "flex", gap: "1em", justifyContent: "flex-end" }} className="save-cancel-buttons">
              <st.FeedbackCancel
                type="button"
                onClick={prepClose}
                value={strings.cancel}
                style={{ marginTop: "1em" }}
              />
              <st.FeedbackSubmit type="submit" value={strings.save} style={{ marginTop: "1em" }} />
            </div>
          )}
        </s.DoneButtonHolder>
      </form>
      {bookmark && (
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
    </>
  );
}
