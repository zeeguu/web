import * as s from "./WordEdit.sc";
import * as st from "../exercises/bottomActions/FeedbackButtons.sc";
import strings from "../i18n/definitions";
import { zeeguuRed, zeeguuDarkRed } from "../components/colors";
import { useState } from "react";

export default function WordEditForm({
  bookmark,
  handleClose,
  updateBookmark,
  deleteAction,
}) {
  const [translation, setTranslation] = useState(bookmark.to);
  const [expression, setExpression] = useState(bookmark.from);
  const [context, setContext] = useState(bookmark.context);

  function prepClose() {
    setTranslation(bookmark.to);
    setExpression(bookmark.from);
    setContext(bookmark.context);
    handleClose();
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
    } else if (
      bookmark.to === translation &&
      bookmark.from === expression &&
      bookmark.context === context
    ) {
      prepClose();
    } else {
      updateBookmark(bookmark, expression, translation, context);
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
        {bookmark.to === translation &&
        bookmark.from === expression &&
        bookmark.context === context ? (
          <s.DoneButtonHolder>
            <st.FeedbackCancel
              onClick={(e) => deleteAction(bookmark)}
              value={strings.deleteWord}
              style={{
                marginLeft: "1em",
                marginTop: "1em",
                maxWidth: "100px",
                textAlign: "center",
                backgroundColor: zeeguuRed,
                borderColor: zeeguuDarkRed,
                color: "white",
                fontWeight: 550,
              }}
            />
            <st.FeedbackCancel
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
