import * as s from "./ArticleReader.sc";

import { useState } from "react";
import { random } from "../utils/basic/arrays";
import SentimentVerySatisfiedOutlinedIcon from '@mui/icons-material/SentimentVerySatisfiedOutlined';
import MoodBadOutlinedIcon from '@mui/icons-material/MoodBadOutlined';
import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions';
import MoodBadTwoToneIcon from '@mui/icons-material/MoodBadTwoTone';
import SentimentNeutralTwoToneIcon from '@mui/icons-material/SentimentNeutralTwoTone';
import SentimentVerySatisfiedTwoToneIcon from '@mui/icons-material/SentimentVerySatisfiedTwoTone';
import SentimentNeutralOutlinedIcon from '@mui/icons-material/SentimentNeutralOutlined';

let FEEDBACK_OPTIONS = { "Easy": 1, "Ok": 3, "Difficult": 5 };

export default function DifficultyFeedbackBox({ api, articleID }) {
  const [answerSubmitted, setAnswerSubmitted] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

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
        <h5 align="center">Thank You {random(["🤗", "🙏", "😊", "🎉"])}</h5>
      </s.FeedbackBox>
    );
  }

  return (
    <s.FeedbackBox>
      <h5>How difficult was this article for you?</h5>
      <s.CenteredContent>
        {Object.keys(FEEDBACK_OPTIONS).map((option) => {
          const emojiSize = { fontSize: 50 };

          const handleMouseEnter = () => {
            setIsHovered(option);
          };

          const handleMouseLeave = () => {
            setIsHovered('');
          };

          const emojiComponent = () => {
            switch (option) {
              case 'Easy':
                return isHovered === option ? (
                  <SentimentVerySatisfiedTwoToneIcon sx={emojiSize} />
                ) : (
                  <SentimentVerySatisfiedOutlinedIcon sx={emojiSize} />
                );
              case 'Difficult':
                return isHovered === option ? (
                  <MoodBadTwoToneIcon sx={emojiSize} />
                ) : (
                  <MoodBadOutlinedIcon sx={emojiSize} />
                );
              case 'Ok':
                return isHovered === option ? (
                  <SentimentNeutralTwoToneIcon sx={emojiSize} />
                ) : (
                  <SentimentNeutralOutlinedIcon sx={emojiSize} />
                );
              default:
                return <EmojiEmotionsIcon sx={emojiSize} />;
            }
          };

          return (
            <s.WhiteButton
              key={option}
              onClick={(e) => submitAnswer(FEEDBACK_OPTIONS[option])}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              {emojiComponent()}
              <br />
              {option}
            </s.WhiteButton>
          );
        })}
      </s.CenteredContent>
    </s.FeedbackBox>
  );
}
