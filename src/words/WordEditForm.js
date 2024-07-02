import * as s from "./WordEdit.sc";
import * as st from "../exercises/bottomActions/FeedbackButtons.sc";
import strings from "../i18n/definitions";
import { useState } from "react";
import { MAX_WORDS_IN_BOOKMARK_FOR_EXERCISES } from "../exercises/ExerciseConstants";

export default function WordEditForm({
  bookmark,
  handleClose,
  updateBookmark,
  deleteAction,
}) {
  const [translation, setTranslation] = useState(bookmark.to);
  const [expression, setExpression] = useState(bookmark.from);
  const [context, setContext] = useState(bookmark.context);
  const [fitForStudy, setFitForStudy] = useState(bookmark.fit_for_study);

  const isEdited =
    bookmark.to === translation &&
    bookmark.from === expression &&
    bookmark.context === context &&
    bookmark.fit_for_study === fitForStudy;

  function prepClose() {
    setTranslation(bookmark.to);
    setExpression(bookmark.from);
    setContext(bookmark.context);
    setFitForStudy(bookmark.fit_for_study);
    handleClose();
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
    } else if (isEdited) {
      prepClose();
    } else {
      updateBookmark(bookmark, expression, translation, context, fitForStudy);
      prepClose();
    }
  }
  return (
    <>
      {bookmark.from.includes(" ") ? (
        <s.Headline>{strings.editExpression}</s.Headline>
      ) : (
        <s.Headline>{strings.editWord}</s.Headline>
      )}
      <form onSubmit={handleSubmit}>
        <s.CustomTextField
          id="outlined-basic"
          label={strings.translation}
          variant="outlined"
          fullWidth
          autoFocus={true}
          value={translation}
          onChange={typingTranslation}
        />
        {bookmark.from.includes(" ") ? (
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
          label={strings.context}
          variant="outlined"
          fullWidth
          multiline
          value={context}
          onChange={typingContext}
        />
        {bookmark.from.split(" ").length <
          MAX_WORDS_IN_BOOKMARK_FOR_EXERCISES && (
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

        {isEdited ? (
          <s.DoneButtonHolder>
            <st.FeedbackDelete
              onClick={(e) => deleteAction(bookmark)}
              value={strings.deleteWord}
            />
            <st.FeedbackSubmit
              type="submit"
              value={strings.done}
              style={{ marginLeft: "1em", marginTop: "1em" }}
            />
          </s.DoneButtonHolder>
        ) : (
          <s.DoneButtonHolder>
            <st.FeedbackCancel
              type="button"
              onClick={prepClose}
              value={strings.cancel}
              style={{ marginLeft: "1em", marginTop: "1em" }}
            />
            <st.FeedbackSubmit
              type="submit"
              value={strings.save}
              style={{ marginLeft: "1em", marginTop: "1em" }}
            />
          </s.DoneButtonHolder>
        )}
      </form>
    </>
  );
}
