import * as s from "../../zeeguu-react/src/reader/ArticleReader.sc";
import { useState } from "react";
import { EXTENSION_SOURCE } from "../constants";
import {
  StyledTextarea,
  StyledForm,
  StyledContainer,
  StyledButton,
  StyledPopup,
} from "./Modal.styles";
import Modal from "react-modal";

export default function UserFeedback({ api, articleId }) {
  const [feedback, setFeedback] = useState("");

  const [modalIsOpen, setModalIsOpen] = useState(false);

  const setModalIsOpenToTrue = () => {
    setModalIsOpen(true);
  };

  const setModalIsOpenToFalse = () => {
    setModalIsOpen(false);
  };

  function handleChange(e) {
    setFeedback(e.target.value);
  }
  function submitFeedback(e) {
    e.preventDefault();
    let feedbackForDB = "problem_" + feedback.replace(/ /g, "_");
    //api.logReaderActivity(EXTENSION_SOURCE, api.EXTENSION_FEEDBACK, articleId, feedbackForDB);
    resetInput(e);
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
          <button
            type="submit"
            value="Send feedback"
            onClick={setModalIsOpenToTrue}
            id="feedback-box"
          >
            Submit feedback
          </button>
        </StyledForm>
      </StyledContainer>
      <StyledPopup
        style={{ overlay: { backgroundColor: "rgba(255, 255, 255, 0.75) !important" } }}
        className="feedback-modal"
        isOpen={modalIsOpen}
      >
        <h2>Thank you for your feedback!</h2>
        <StyledButton onClick={setModalIsOpenToFalse}>Close</StyledButton>
      </StyledPopup>
    </s.FeedbackBox>
  );
}
