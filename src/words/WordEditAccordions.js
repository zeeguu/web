import { useState, useEffect } from "react";
import * as s from "./WordEdit.sc";
import * as sc from "../exercises/bottomActions/FeedbackButtons.sc";
import TextField from "@mui/material/TextField";
import strings from "../i18n/definitions";

export default function WordEditAccordions({ bookmark, updateBookmark }) {
  const [expanded, setExpanded] = useState("panel1");
  const [translation, setTranslation] = useState(bookmark.to);
  const [expression, setExpression] = useState(bookmark.from);
  const [context, setContext] = useState(bookmark.context);
  const [reload, setReload] = useState(false);

  useEffect(() => {}, [reload]);

  const handleChange = (panel) => (event, newExpanded) => {
    setExpanded(newExpanded ? panel : false);
  };

  function handleTyping(event) {
    switch (expanded) {
      case "panel1":
        setTranslation(event.target.value);
        break;
      case "panel2":
        setExpression(event.target.value);
        break;
      case "panel3":
        setContext(event.target.value);
        break;
      default:
        setTranslation(event.target.value);
    }
  }

  function handleSubmit(event) {
    switch (expanded) {
      case "panel1":
        if (translation === "") {
          setTranslation(bookmark.to);
          event.preventDefault();
        } else {
          updateBookmark(
            bookmark,
            bookmark.from,
            translation,
            bookmark.context
          );
          setReload(!reload);
          event.preventDefault();
        }
        break;
      case "panel2":
        if (expression === "") {
          setExpression(bookmark.from);
          event.preventDefault();
        } else {
          updateBookmark(bookmark, expression, bookmark.to, bookmark.context);
          setReload(!reload);
          event.preventDefault();
        }
        break;
      case "panel3":
        if (context === "") {
          setContext(bookmark.context);
          event.preventDefault();
        } else {
          updateBookmark(bookmark, bookmark.from, bookmark.to, context);
          setReload(!reload);
          event.preventDefault();
        }
        break;
      default:
        if (translation === "") {
          setTranslation(bookmark.to);
          event.preventDefault();
        } else {
          updateBookmark(
            bookmark,
            bookmark.from,
            translation,
            bookmark.context
          );
          setReload(!reload);
          event.preventDefault();
        }
        break;
    }
  }

  return (
    <div>
      <s.Headline>
        {bookmark.from} — {bookmark.to}
      </s.Headline>
      <s.Accordion
        expanded={expanded === "panel1"}
        onChange={handleChange("panel1")}
      >
        <s.AccordionSummary aria-controls="panel1d-content" id="panel1d-header">
          <p>{strings.editTranslation}</p>
        </s.AccordionSummary>
        <s.AccordionDetails>
          <s.Paragraph>
            {strings.currentTranslation}
            <span style={{ fontStyle: "normal" }}>{bookmark.to}</span>
          </s.Paragraph>
          <form onSubmit={handleSubmit}>
            <TextField
              id="outlined-basic"
              label={strings.editTranslation}
              variant="outlined"
              fullWidth
              value={translation}
              onChange={handleTyping}
            />
            {bookmark.to === translation ? (
              <></>
            ) : (
              <s.DoneButtonHolder>
                <sc.FeedbackSubmit
                  type="submit"
                  value={strings.submit}
                  style={{ marginTop: "1em" }}
                />
              </s.DoneButtonHolder>
            )}
          </form>
        </s.AccordionDetails>
      </s.Accordion>
      <s.Accordion
        expanded={expanded === "panel2"}
        onChange={handleChange("panel2")}
      >
        <s.AccordionSummary aria-controls="panel2d-content" id="panel2d-header">
          {bookmark.from.includes(" ") ? (
            <p>{strings.editExpression}</p>
          ) : (
            <p>{strings.editWord}</p>
          )}
        </s.AccordionSummary>
        <s.AccordionDetails>
          {bookmark.from.includes(" ") ? (
            <s.Paragraph>
              {strings.currentExpression}
              <span style={{ fontStyle: "normal" }}>{bookmark.from}</span>
            </s.Paragraph>
          ) : (
            <s.Paragraph>
              {strings.currentWord}
              <span style={{ fontStyle: "normal" }}>{bookmark.from}</span>
            </s.Paragraph>
          )}
          <form onSubmit={handleSubmit}>
            {bookmark.from.includes(" ") ? (
              <TextField
                id="outlined-basic"
                label={strings.editExpression}
                variant="outlined"
                fullWidth
                value={expression}
                onChange={handleTyping}
              />
            ) : (
              <TextField
                id="outlined-basic"
                label={strings.editWord}
                variant="outlined"
                fullWidth
                value={expression}
                onChange={handleTyping}
              />
            )}
            {bookmark.from === expression ? (
              <></>
            ) : (
              <s.DoneButtonHolder>
                <sc.FeedbackSubmit
                  type="submit"
                  value={strings.submit}
                  style={{ marginTop: "1em" }}
                />
              </s.DoneButtonHolder>
            )}
          </form>
        </s.AccordionDetails>
      </s.Accordion>
      <s.Accordion
        expanded={expanded === "panel3"}
        onChange={handleChange("panel3")}
      >
        <s.AccordionSummary aria-controls="panel3d-content" id="panel3d-header">
          <p>{strings.editContext}</p>
        </s.AccordionSummary>
        <s.AccordionDetails>
          <s.Paragraph>
            {strings.currentContext}
            <span style={{ fontStyle: "normal" }}>{bookmark.context}</span>
          </s.Paragraph>
          <form onSubmit={handleSubmit}>
            <TextField
              id="outlined-basic"
              label={strings.editContext}
              variant="outlined"
              fullWidth
              multiline
              value={context}
              onChange={handleTyping}
            />
            {bookmark.context === context ? (
              <></>
            ) : (
              <s.DoneButtonHolder>
                <sc.FeedbackSubmit
                  type="submit"
                  value={strings.submit}
                  style={{ marginTop: "1em" }}
                />
              </s.DoneButtonHolder>
            )}
          </form>
        </s.AccordionDetails>
      </s.Accordion>
    </div>
  );
}
