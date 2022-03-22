import * as s from "../../zeeguu-react/src/reader/ArticleReader.sc";
import { useState } from "react";
import { EXTENSION_SOURCE } from "../constants";
import {
  StyledTextarea,
  StyledForm,
  StyledContainer,
  StyledPopup,
  StyledFeedbackButton,
  ErrorMessage,
} from "./Modal.styles";
import sendFeedbackEmail from "./sendEmail";

export default function UserFeedback({ api, articleId, url }) {
  const [feedback, setFeedback] = useState("");
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [isEmpty, setIsEmpty] = useState(false);

  const setModalIsOpenToTrue = () => {
    if (feedback === "") {
      setIsEmpty(true);
    } else {
      setIsEmpty(false);
      setModalIsOpen(true);
    }
  };

  const setModalIsOpenToFalse = () => {
    setModalIsOpen(false);
  };

  function handleChange(e) {
    setFeedback(e.target.value);
    if (feedback !== "") {
      setIsEmpty(false);
    }
  }

  function submitFeedback(e) {
    e.preventDefault();
    if (!isEmpty) {
      let feedbackForDB = "problem_" + feedback.replace(/ /g, "_");
      //api.logReaderActivity(EXTENSION_SOURCE, api.EXTENSION_FEEDBACK, articleId, feedbackForDB);
      sendFeedbackEmail(feedback, url, articleId)
      resetInput(e);
    }
  }

  function resetInput(e) {
    setFeedback((e.target.value = ""));
  }
  return (
    <s.FeedbackBox>
      <StyledContainer>
        <h2>We are always trying to improve the Zeeguu Extension</h2>
        <small>
          Please let us know if you experience any problems, or if the article
          looks wrong.
        </small>
        <br />
        <br />
        <StyledForm onSubmit={submitFeedback}>
          <StyledTextarea
            name="feedback"
            onChange={handleChange}
            value={feedback}
            placeholder="Write here"
          />
          {isEmpty ? (
            <ErrorMessage>Please write something</ErrorMessage>
          ) : null}
          <StyledFeedbackButton
            type="submit"
            value="Send feedback"
            onClick={setModalIsOpenToTrue}
            id="feedback-box"
          >
            Submit feedback
          </StyledFeedbackButton>
        </StyledForm>
      </StyledContainer>
      <StyledPopup
        className="feedback-modal"
        isOpen={modalIsOpen}
        overlayClassName={"feedback-overlay"}
      >
        <h3>Thank you for your feedback!</h3>
        <StyledFeedbackButton onClick={setModalIsOpenToFalse}>
          Close
        </StyledFeedbackButton>
      </StyledPopup>
    </s.FeedbackBox>
  );
}
