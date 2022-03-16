import * as s from "../../zeeguu-react/src/reader/ArticleReader.sc";
import { useState } from "react";
import { EXTENSION_SOURCE } from "../constants";

export default function UserFeedback({api, articleId}) {

const [feedback, setFeedback] = useState();

   function handleChange(e) {
        setFeedback({value: e.target.value})
        console.log("text", feedback)
      }
    function submitFeedback(e) {
        e.preventDefault();
        //api.logReaderActivity(EXTENSION_SOURCE, api.EXTENSION_FEEDBACK, articleId, feedback);
        resetInput(e)
        
    }
    function resetInput(e) {
        setFeedback(e.target.value = "");
        feedback.value = "";
    }
  return (
    <s.FeedbackBox>
      <p>
        We are always trying to improve the Zeeguu Extension. Please let us know
        if you experience any problems, or if you cannot access the
        article
      </p>
      <form onSubmit={submitFeedback}>
        <textarea rows="5" cols="50" name="feedback" onChange={handleChange}></textarea>
        <input type="submit" value = "Send feedback"></input>
      </form>
    </s.FeedbackBox>
  );
}
