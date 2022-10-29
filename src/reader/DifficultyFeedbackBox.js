import * as s from "./ArticleReader.sc";

import { useState } from "react";

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
    return <s.FeedbackBox>Thank You!</s.FeedbackBox>;
  }

  return (
    <s.FeedbackBox>
      <small>
        Let's ensure that Zeeguu finds articles of the right difficulty for you
        in the future
      </small>

      <h4>How was the difficulty of the article for you?</h4>

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
