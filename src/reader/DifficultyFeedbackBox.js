import * as s from "./ArticleReader.sc";

import { useState } from "react";
import { random } from "../utils/basic/arrays";

let FEEDBACK_OPTIONS = { "Too Easy": 1, Ok: 3, "Too Hard": 5 };

export default function DifficultyFeedbackBox({ api, articleID }) {
  const [answerSubmitted, setAnswerSubmitted] = useState(false);

  function submitAnswer(answer) {
    api.submitArticleDifficultyFeedback(
      { article_id: articleID, difficulty: answer },
      () => {
        setAnswerSubmitted(true);
      }
    );
  }

  if (answerSubmitted) {
    return (
      <s.FeedbackBox>
        <p align="center">Thank You {random(["🤗", "🙏", "😊", "🎉"])}</p>
      </s.FeedbackBox>
    );
  }

  return (
    <s.FeedbackBox>
      <small>
        To improve future recommendations please answer the following:
      </small>
      <h4>How difficult was this article for you?</h4>

      <s.CenteredContent>
        {Object.keys(FEEDBACK_OPTIONS).map((option) => (
          <s.WhiteButton
            onClick={(e) => submitAnswer(FEEDBACK_OPTIONS[option])}
          >
            {option}
          </s.WhiteButton>
        ))}
      </s.CenteredContent>
    </s.FeedbackBox>
  );
}
