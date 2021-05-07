import Word from "../words/Word";
import * as s from "../reader/ArticleReader.sc";
import { Link } from "react-router-dom";

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

      <h2>&nbsp;&nbsp;&nbsp;Good Job! 🥳 🎉 </h2>

      {correctBookmarks.length > 0 && (
        <h3>
          😊 Correct
          <br />
          <br />
          {removeArrayDuplicates(correctBookmarks).map((each) => (
            <Word key={each.id} bookmark={each} api={api} />
          ))}
        </h3>
      )}

      {incorrectBookmarks.length > 0 && (
        <h3>
          <br />
          <br />
          😳 Pay more attention to
          <br />
          <br />
          {removeArrayDuplicates(incorrectBookmarks).map((each) => (
            <Word key={each.id} bookmark={each} api={api} />
          ))}
        </h3>
      )}

      <br />
      <br />

      <s.ContentOnRow>
        <Link to={`/exercises`} onClick={(e) => window.location.reload(false)}>
          <s.OrangeButton>Keep Exercising</s.OrangeButton>
        </Link>

        <Link to={`/articles`}>
          <s.WhiteButton>Back to Reading</s.WhiteButton>
        </Link>
      </s.ContentOnRow>
    </s.NarrowColumn>
  );
}
