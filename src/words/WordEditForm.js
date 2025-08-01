import * as s from "./WordEdit.sc";
import * as st from "../exercises/bottomActions/FeedbackButtons.sc";
import strings from "../i18n/definitions";
import { useState } from "react";
import { MAX_WORDS_IN_BOOKMARK_FOR_EXERCISES } from "../exercises/ExerciseConstants";
import isBookmarkExpression from "../utils/misc/isBookmarkExpression";
import FullWidthErrorMsg from "../components/FullWidthErrorMsg.sc";

export default function WordEditForm({ bookmark, errorMessage, handleClose, updateBookmark, deleteAction }) {
  const [translation, setTranslation] = useState(bookmark.to);
  const [expression, setExpression] = useState(bookmark.from);
  const [context, setContext] = useState(bookmark.context);
  const [fitForStudy, setFitForStudy] = useState(bookmark.fit_for_study);

  const isNotEdited =
    bookmark.to === translation &&
    bookmark.from === expression &&
    bookmark.context === context &&
    bookmark.fit_for_study === fitForStudy;

  function prepClose() {
    setTranslation(bookmark.to);
    setExpression(bookmark.from);
    setContext(bookmark.context);
    setFitForStudy(bookmark.fit_for_study);
  }

  function handleFitForStudyCheck() {
    setFitForStudy((state) => !state);
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
      updateBookmark(bookmark, expression, translation, context, fitForStudy);
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
          <s.CustomTextField
            id="outlined-basic"
            label={strings.expression}
            variant="outlined"
            fullWidth
            value={expression}
            onChange={typingExpression}
          />
        ) : (
          <s.CustomTextField
            id="outlined-basic"
            label={strings.word}
            variant="outlined"
            fullWidth
            value={expression}
            onChange={typingExpression}
          />
        )}
        <s.CustomTextField
          id="outlined-basic"
          label={strings.translation}
          variant="outlined"
          fullWidth
          value={translation}
          onChange={typingTranslation}
        />

        <s.CustomTextField
          id="outlined-basic"
          label="Example"
          variant="outlined"
          fullWidth
          multiline
          value={context}
          onChange={typingContext}
        />

        {bookmark.from.split(" ").length < MAX_WORDS_IN_BOOKMARK_FOR_EXERCISES && (
          <s.CustomCheckBoxDiv>
            <input
              style={{ width: "1.5em" }}
              type={"checkbox"}
              checked={fitForStudy}
              onChange={handleFitForStudyCheck}
            />
            <label>Include Word in Exercises</label>
          </s.CustomCheckBoxDiv>
        )}

        {window.location.hostname === 'localhost' && (
          <div style={{ 
            margin: "1em 0",
            padding: "0.5em",
            backgroundColor: "#f0f8f0",
            border: "1px solid #4CAF50",
            borderRadius: "4px",
            fontSize: "0.85em", 
            color: "#2e7d32"
          }}>
            <div style={{ fontWeight: "bold", marginBottom: "0.3em" }}>Debug Info:</div>
            <div>Bookmark ID: {bookmark.id}</div>
            {bookmark.user_word_id && (
              <div>User Word ID: {bookmark.user_word_id}</div>
            )}
            {bookmark.meaning_id && (
              <div>Meaning ID: {bookmark.meaning_id}</div>
            )}
          </div>
        )}

        {isNotEdited ? (
          <s.DoneButtonHolder>
            <st.FeedbackSubmit type="submit" value={strings.done} style={{ marginLeft: "1em", marginTop: "1em" }} />
          </s.DoneButtonHolder>
        ) : (
          <s.DoneButtonHolder>
            <st.FeedbackCancel
              type="button"
              onClick={prepClose}
              value={strings.cancel}
              style={{ marginLeft: "1em", marginTop: "1em" }}
            />
            <st.FeedbackSubmit type="submit" value={strings.save} style={{ marginLeft: "1em", marginTop: "1em" }} />
          </s.DoneButtonHolder>
        )}
      </form>
    </>
  );
}
