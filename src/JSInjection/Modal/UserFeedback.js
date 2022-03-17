import * as s from "../../zeeguu-react/src/reader/ArticleReader.sc";
import { useState } from "react";
import { EXTENSION_SOURCE } from "../constants";
import { StyledTextarea, StyledForm, StyledContainer } from "./Modal.styles";

export default function UserFeedback({api, articleId}) {

const [feedback, setFeedback] = useState("");

   function handleChange(e) {
        setFeedback(e.target.value)
        console.log("text", feedback)
      }
    function submitFeedback(e) {
        e.preventDefault();
        //api.logReaderActivity(EXTENSION_SOURCE, api.EXTENSION_FEEDBACK, articleId, feedback);
        resetInput(e)
        alert("Thanks for your feedback!")
        
    }
    function resetInput(e) {
        setFeedback(e.target.value = "");
    }
  return (
    <s.FeedbackBox>
    <StyledContainer>
      <h2>We are always trying to improve the Zeeguu Extension</h2>
      <small>
        Please let us know
        if you experience any problems, or if you cannot access the
        article
      </small>
      <br/>
      <br/>
      <StyledForm onSubmit={submitFeedback}>
        <StyledTextarea name="feedback" onChange={handleChange} value={feedback}/>
        <button type="submit" value = "Send feedback">Submit feedback</button>
      </StyledForm>
      </StyledContainer>
    </s.FeedbackBox>
  );
}