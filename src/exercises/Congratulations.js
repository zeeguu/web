import Word from "../words/Word";
import * as s from "../reader/ArticleReader.sc";
import { Link } from "react-router-dom";
import strings from "../i18n/definitions";

export default function Congratulations({
  articleID,
  correctBookmarks,
  incorrectBookmarks,
  api,
}) {
  function removeArrayDuplicates(array) {
    var set = new Set(array);
    var newArray = Array.from(set);
    return newArray;
  }

  return (
    <s.NarrowColumn>
      <br />

      <h2>&nbsp;&nbsp;&nbsp;{strings.goodJob} 🥳 🎉 </h2>

      {correctBookmarks.length > 0 && (
        <h3>
          😊 {strings.correct}
          {removeArrayDuplicates(correctBookmarks).map((each) => (
            <s.ContentOnRow key={"row_" + each.id}>
              <Word key={each.id} bookmark={each} api={api} />
            </s.ContentOnRow>
          ))}
        </h3>
      )}

      {incorrectBookmarks.length > 0 && (
        <h3>
          <br />
          😳 {strings.payMoreAttentionTo}
          {removeArrayDuplicates(incorrectBookmarks).map((each) => (
            <s.ContentOnRow key={"row_" + each.id}>
              <Word key={each.id} bookmark={each} api={api} />
            </s.ContentOnRow>
          ))}
        </h3>
      )}

      <s.ContentOnRow>
        <Link to={`/exercises`} onClick={(e) => window.location.reload(false)}>
          <s.OrangeButton>{strings.keepExercising}</s.OrangeButton>
        </Link>

        <Link to={`/articles`}>
          <s.WhiteButton>{strings.backToReading}</s.WhiteButton>
        </Link>
      </s.ContentOnRow>
    </s.NarrowColumn>
  );
}
