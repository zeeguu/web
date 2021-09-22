import * as s from "./exerciseTypes/Exercise.sc";
import * as sc from "../reader/ArticleReader.sc";
import strings from "../i18n/definitions";
import { useHistory } from "react-router-dom";

export default function OutOfWordsMessage({ action }) {
  const history = useHistory();

  function onClickAction() {
    if (!action) {
      return history.push("/articles");
    } else {
      return history.goBack();
    }
  }
  return (
    <s.Exercise>
      <div className="contextExample">
        <h4>{strings.noTranslatedWords}</h4>
        {!action ? (
          <h4>{strings.goToTextsToTranslateWords}</h4>
        ) : (
          <h4>{strings.goStarTranslations}</h4>
        )}
      </div>
      <s.BottomRow>
        {!action ? (
          <sc.OrangeButton onClick={onClickAction}>
            {strings.backToReading}
          </sc.OrangeButton>
        ) : (
          <sc.OrangeButton onClick={onClickAction}>
            {strings.backToWords}
          </sc.OrangeButton>
        )}
      </s.BottomRow>
    </s.Exercise>
  );
}
