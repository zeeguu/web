import { useEffect, useState, useContext } from "react";
import { setTitle } from "../assorted/setTitle";
import useFormField from "../hooks/useFormField";
import * as s from "../components/FormPage.sc";
import strings from "../i18n/definitions";
import { PageTitle } from "../components/PageTitle";

export default function FeedbackPage({ api }) {
  const feedbackOptions = [
    "Article Recommendations",
    "Article Reader",
    "Exercises",
    "Extension",
    "Other",
  ];

  const [feedbackTypeSelection, feedbackTypeSelectionChange] = useFormField(
    feedbackOptions[0],
  );
  const [feedbackMessage, feedbackMessageChange] = useFormField("");

  useEffect(() => {
    setTitle(strings.feedbackTab);
    // eslint-disable-next-line
  }, []);

  function onSubmit() {
    api.sendFeedback(feedbackMessage, feedbackTypeSelection);
  }

  return (
    <>
      <PageTitle>{strings.feedbackTab}</PageTitle>

      <s.FormContainer>
        <label>Which component do you want to give feedback on?</label>
        <select
          name="component_to_give_feedback_on"
          onChange={feedbackTypeSelectionChange}
        >
          {feedbackOptions.map((each) => (
            <option key={each} code={each}>
              {each}
            </option>
          ))}
        </select>
        <label>Your message:</label>
        <textarea
          id="feedback_text"
          name="feedback_text"
          rows="5"
          cols="50"
          onChange={feedbackMessageChange}
          placeholder="Feedback message, e.g. 'Can't get translations.'"
        ></textarea>
        <br></br>
        <s.FormButton onClick={onSubmit}>Send</s.FormButton>
      </s.FormContainer>
    </>
  );
}
