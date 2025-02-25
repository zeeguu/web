import { Fragment, useEffect, useState } from "react";
import { StyledTooltip } from "../../styledComponents/StyledTooltip.sc";
import { StarExplanation } from "../exercisesPage/AttemptIcons";
import { InfoOutlined } from "@mui/icons-material";
import strings from "../../../i18n/definitions";
import * as s from "../../styledComponents/StudentTranslations.sc";

const StudentTranslations = ({ article }) => {
  const [translations, setTranslations] = useState(null);

  useEffect(() => {
    if (article) {
      const filteredArray = article.translations.reduce((acc, current) => {
        const found = acc.find((item) => item.id === current.id);
        if (!found) {
          return acc.concat([current]);
        } else {
          return acc;
        }
      }, []);

      setTranslations(filteredArray);
    }
    //eslint-disable-next-line
  }, []);

  const DivideSentence = ({ sentence, word, isPracticed }) => {
    const wordStart = sentence.indexOf(word);
    const prefix = sentence.substring(0, wordStart);
    const wordLength = word.length;
    const suffix = sentence.substring(wordStart + wordLength);

    return (
      <s.StyledStudentTranslations>
        <div className="sentences-containing-translated-word">
          {prefix}
          <span className="translated-exercised-word">
            <b>{word}</b>
          </span>
          {isPracticed === 1 && (
            <span className="star-indicating-translated-word-being-exercised">
              <b>*</b>
            </span>
          )}
          {suffix}
        </div>{" "}
      </s.StyledStudentTranslations>
    );
  };

  return (
    <s.StyledStudentTranslations>
      <Fragment>
        <div className="dropdown-headline-container">
          <h4 className="panel-headline">
            {strings.translatedWordsInSentence}
          </h4>
          <StyledTooltip label={StarExplanation()}>
            <InfoOutlined className="information-icon" />
          </StyledTooltip>
        </div>
        {translations &&
          translations.map((translation) => (
            <DivideSentence
              key={translation.id}
              sentence={translation.context}
              word={translation.word}
              isPracticed={translation.practiced}
            />
          ))}

        {translations === null ||
          (translations.length === 0 && (
            <p className="panel-no-words">{strings.translatedWordInText}</p>
          ))}
      </Fragment>
    </s.StyledStudentTranslations>
  );
};
export default StudentTranslations;
