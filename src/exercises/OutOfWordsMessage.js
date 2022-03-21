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
        <h4>{strings.noTranslatedWords}</h4>
        <h4>{message}</h4>
      </div>
      <s.BottomRow>
        <sc.OrangeButton onClick={buttonAction}>{buttonText}</sc.OrangeButton>
      </s.BottomRow>
    </s.Exercise>
  );
}
