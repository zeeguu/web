import Word from "../words/Word";
import * as s from "../reader/ArticleReader.sc";
import strings from "../i18n/definitions";
import { useState } from "react";

import { removeArrayDuplicates } from "../utils/basic/arrays";

export default function Congratulations({
  articleID,
  correctBookmarks,
  incorrectBookmarks,
  api,
  backButtonAction,
  keepExercisingAction,
}) {
  const [correctBookmarksToDisplay, setCorrectBookmarksToDisplay] = useState(
    removeArrayDuplicates(correctBookmarks)
  );
  const [incorrectBookmarksToDisplay, setIncorrectBookmarksToDisplay] =
    useState(removeArrayDuplicates(incorrectBookmarks));

  function deleteBookmark(bookmark) {
    setCorrectBookmarksToDisplay(
      correctBookmarksToDisplay.filter((e) => e.id !== bookmark.id)
    );
    setIncorrectBookmarksToDisplay(
      incorrectBookmarksToDisplay.filter((e) => e.id !== bookmark.id)
    );
  }

  return (
    <s.NarrowColumn className="narrowColumn">
      <br />

      <h2>&nbsp;&nbsp;&nbsp;{strings.goodJob} 🥳 🎉 </h2>

      {correctBookmarksToDisplay.length > 0 && (
        <h3>
          😊 {strings.correct}
          {correctBookmarksToDisplay.map((each) => (
            <s.ContentOnRow className="contentOnRow" key={"row_" + each.id}>
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
            <s.ContentOnRow className="contentOnRow" key={"row_" + each.id}>
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

      <s.ContentOnRow className="contentOnRow">
        <s.OrangeButton className="orangeButton" onClick={keepExercisingAction}>
          {strings.keepExercising}
        </s.OrangeButton>
        <s.WhiteButton className="whiteButton" onClick={backButtonAction}>
          {strings.backToReading}
        </s.WhiteButton>
      </s.ContentOnRow>
    </s.NarrowColumn>
  );
}
