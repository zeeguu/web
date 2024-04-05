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

export default function DifficultyFeedbackBox({
  articleInfo,
  updateArticleDifficultyFeedback,
}) {
  const [isHovered, setIsHovered] = useState(false);

  const difficultyToOption = (difficulty) => {
    if (difficulty === 1) return "Easy";
    else if (difficulty === 3) return "Ok";
    else if (difficulty === 5) return "Difficult";
  };
  const difficultyFeedback = difficultyToOption(articleInfo.relative_difficulty);

  const hasInteraction = (option) => {
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
                return hasInteraction(option) ? (
                  <SentimentVerySatisfiedTwoToneIcon sx={emojiSize} />
                ) : (
                  <SentimentVerySatisfiedOutlinedIcon sx={emojiSize} />
                );
              case 'Difficult':
                return hasInteraction(option) ? (
                  <MoodBadTwoToneIcon sx={emojiSize} />
                ) : (
                  <MoodBadOutlinedIcon sx={emojiSize} />
                );
              case 'Ok':
                return hasInteraction(option) ? (
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