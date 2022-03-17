import Word from "../words/Word";
import * as s from "../reader/ArticleReader.sc";
import strings from "../i18n/definitions";
import { useState } from "react";

export const EXTENSION_SOURCE = "EXTENSION";

export default function Congratulations({
  articleID,
  correctBookmarks,
  incorrectBookmarks,
  api,
  backToReading,
  keepExercising,
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
        <s.OrangeButton onClick={keepExercising}>
          {strings.keepExercising}
        </s.OrangeButton>
        <s.WhiteButton onClick={backToReading}>
          {strings.backToReading}
        </s.WhiteButton>
      </s.ContentOnRow>
    </s.NarrowColumn>
  );
}
