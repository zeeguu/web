import * as s from "./exerciseTypes/Exercise.sc";
import * as sc from "../reader/ArticleReader.sc";
import strings from "../i18n/definitions";
import Pluralize from "../utils/text/pluralize";

export default function OutOfWordsMessage({
  totalInLearning,
  goBackAction,
  keepExercisingAction,
}) {
  return (
    <s.Exercise>
      <div className="contextExample">
        <h2>{strings.noTranslatedWords}</h2>
        <p>
          This means you already practiced all the words you have translated and
          have selected to be part of the exercises. These are scheduled
          according to our spaced-repetition and we will let you know when it is
          time to train them again.
        </p>
        <p>You can always go read to find new words to start learning.</p>
        <p>
          You are currently learning <b>{totalInLearning}</b>{" "}
          {Pluralize.word(totalInLearning)}.
        </p>
      </div>
      <s.BottomRow>
        <sc.OrangeButton onClick={goBackAction}>
          {"Go to reading"}
        </sc.OrangeButton>
      </s.BottomRow>
    </s.Exercise>
  );
}
