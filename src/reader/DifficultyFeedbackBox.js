import * as s from "./ArticleReader.sc";

import { useState } from "react";
import SentimentVerySatisfiedOutlinedIcon from '@mui/icons-material/SentimentVerySatisfiedOutlined';
import MoodBadOutlinedIcon from '@mui/icons-material/MoodBadOutlined';
import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions';
import MoodBadTwoToneIcon from '@mui/icons-material/MoodBadTwoTone';
import SentimentNeutralTwoToneIcon from '@mui/icons-material/SentimentNeutralTwoTone';
import SentimentVerySatisfiedTwoToneIcon from '@mui/icons-material/SentimentVerySatisfiedTwoTone';
import SentimentNeutralOutlinedIcon from '@mui/icons-material/SentimentNeutralOutlined';

let FEEDBACK_OPTIONS = { "Easy": 1, "Ok": 3, "Difficult": 5 };

export default function DifficultyFeedbackBox({ api, articleInfo, setArticleInfo, setAnswerSubmitted, source }) {
  const [isHovered, setIsHovered] = useState(false);

  function updateArticleDifficultyFeedback(answer) {
    let newArticleInfo = { ...articleInfo, relative_difficulty: answer};
    api.submitArticleDifficultyFeedback(
      { article_id: articleInfo.id, difficulty: answer },
      () => {
        setAnswerSubmitted(true);
        setArticleInfo(newArticleInfo);
      }
    );
    api.logReaderActivity(api.DIFFICULTY_FEEDBACK, articleInfo.id, answer, source);
  }

  const diffToOption = (diff) => {
    return diff === 1 ? "Easy" : diff === 3 ? "Ok" : diff === 5 ? "Difficult" : undefined;
  };
  const difficultyFeedback = diffToOption(articleInfo.relative_difficulty);

  const shouldBeMarked = (option) => {
    const optionIsHovered = isHovered === option;
    const optionIsSelected = difficultyFeedback === option;
    return optionIsHovered || optionIsSelected;
  }

  return (
    <>
    <s.InvisibleBox>
      <h4>How easy was this text?</h4>
      <s.CenteredContent>
        {Object.keys(FEEDBACK_OPTIONS).map((option) => {
          const emojiSize = { fontSize: '2.5em' };

          const handleMouseEnter = () => {
            setIsHovered(option);
          };

          const handleMouseLeave = () => {
            setIsHovered('');
          };

          const emojiComponent = () => {
            switch (option) {
              case 'Easy':
                return shouldBeMarked(option) ? (
                  <SentimentVerySatisfiedTwoToneIcon sx={emojiSize} />
                ) : (
                  <SentimentVerySatisfiedOutlinedIcon sx={emojiSize} />
                );
              case 'Difficult':
                return shouldBeMarked(option) ? (
                  <MoodBadTwoToneIcon sx={emojiSize} />
                ) : (
                  <MoodBadOutlinedIcon sx={emojiSize} />
                );
              case 'Ok':
                return shouldBeMarked(option) ? (
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
              onClick={(e) => updateArticleDifficultyFeedback(FEEDBACK_OPTIONS[option])}
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
    </s.InvisibleBox>
    </>
  );
}