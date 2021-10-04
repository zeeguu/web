import Word from "../words/Word";
import * as s from "../reader/ArticleReader.sc";
import { Link } from "react-router-dom";
import strings from "../i18n/definitions";
import { useState } from "react";

export default function Congratulations({
  articleID,
  correctBookmarks,
  incorrectBookmarks,
  api,
}) {
  const [correctBookmarksToDisplay, setCorrectBookmarksToDisplay] = useState(
    removeArrayDuplicates(correctBookmarks)
  );
  const [incorrectBookmarksToDisplay, setIncorrectBookmarksToDisplay] =
    useState(removeArrayDuplicates(incorrectBookmarks));

  function removeArrayDuplicates(array) {
    var set = new Set(array);
    var newArray = Array.from(set);
    return newArray;
  }

  function deleteBookmark(bookmark) {
    setCorrectBookmarksToDisplay(
      correctBookmarksToDisplay.filter((e) => e.id !== bookmark.id)
    );
    setIncorrectBookmarksToDisplay(
      incorrectBookmarksToDisplay.filter((e) => e.id !== bookmark.id)
    );
  }

  return (
    <s.NarrowColumn>
      <br />

      <h2>&nbsp;&nbsp;&nbsp;{strings.goodJob} 🥳 🎉 </h2>

      {correctBookmarksToDisplay.length > 0 && (
        <h3>
          😊 {strings.correct}
          {correctBookmarksToDisplay.map((each) => (
            <s.ContentOnRow key={"row_" + each.id}>
              <Word
                key={each.id}
                bookmark={each}
                notifyDelete={deleteBookmark}
                api={api}
              />
            </s.ContentOnRow>
          ))}
        </h3>
      )}

      {incorrectBookmarksToDisplay.length > 0 && (
        <h3>
          <br />
          😳 {strings.payMoreAttentionTo}
          {incorrectBookmarksToDisplay.map((each) => (
            <s.ContentOnRow key={"row_" + each.id}>
              <Word
                key={each.id}
                bookmark={each}
                notifyDelete={deleteBookmark}
                api={api}
              />
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
