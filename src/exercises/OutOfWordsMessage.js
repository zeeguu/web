import * as s from "./exerciseTypes/Exercise.sc";
import * as sc from "../reader/ArticleReader.sc";
import strings from "../i18n/definitions";

export default function OutOfWordsMessage({
  message,
  buttonAction,
  buttonText,
}) {
  return (
    <s.Exercise>
      <div className="contextExample">
        <h2>{strings.noTranslatedWords}</h2>
        <p>
          The reason might be that you either have not enough translations, or
          you might have already practiced enough your current words and the
          spaced repetition algo thinks you should take a break for now
        </p>
        <p>
          The best thing is to do some more reading, translate more words, and
          then come back here to practice the new words
        </p>
      </div>
      <s.BottomRow>
        <sc.OrangeButton onClick={buttonAction}>{buttonText}</sc.OrangeButton>
      </s.BottomRow>
    </s.Exercise>
  );
}
