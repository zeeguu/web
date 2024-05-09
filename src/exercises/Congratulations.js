import Word from "../words/Word";
import * as s from "../reader/ArticleReader.sc";
import strings from "../i18n/definitions";
import { useState, useEffect } from "react";
import { CenteredColumn } from "./Congratulations.sc";
import { removeArrayDuplicates } from "../utils/basic/arrays";
import { LoadingAnimation } from "../components/LoadingAnimation.sc";
import LocalStorage from "../assorted/LocalStorage";
import { timeToHumanReadable } from "../utils/misc/readableTime";

export default function Congratulations({
  articleID,
  articleTitle,
  articleURL,
  correctBookmarks,
  incorrectBookmarks,
  api,
  backButtonAction,
  keepExercisingAction,
  source,
  totalTime,
}) {
  const [correctBookmarksToDisplay, setCorrectBookmarksToDisplay] = useState(
    removeArrayDuplicates(correctBookmarks),
  );
  const [incorrectBookmarksToDisplay, setIncorrectBookmarksToDisplay] =
    useState(removeArrayDuplicates(incorrectBookmarks));

  const [username, setUsername] = useState();

  function deleteBookmark(bookmark) {
    setCorrectBookmarksToDisplay(
      correctBookmarksToDisplay.filter((e) => e.id !== bookmark.id),
    );
    setIncorrectBookmarksToDisplay(
      incorrectBookmarksToDisplay.filter((e) => e.id !== bookmark.id),
    );
  }

  useEffect(() => {
    let userInfo = LocalStorage.userInfo();
    let name = userInfo.name;
    setUsername(name);
    api.logUserActivity(api.COMPLETED_EXERCISES, articleID, "", source);
  }, []);

  if (username === undefined) {
    return <LoadingAnimation />;
  }

  return (
    <>
      <s.NarrowColumn className="narrowColumn">
        <br />
        <CenteredColumn className="centeredColumn">
          <h1>
            {strings.goodJob} {username}!
          </h1>
        </CenteredColumn>
        <div style={{ fontSize: "small" }}>
          This exercise session took {timeToHumanReadable(totalTime)}
        </div>
        {articleID && (
          <p>
            You practiced words from: <a href={articleURL}>{articleTitle}</a>
          </p>
        )}
        {correctBookmarksToDisplay.length > 0 && (
          <>
            <h3>😊 {strings.correct}</h3>
            <div>
              {correctBookmarksToDisplay.map((each) => (
                <s.ContentOnRow className="contentOnRow" key={"row_" + each.id}>
                  <Word
                    key={each.id}
                    bookmark={each}
                    notifyDelete={deleteBookmark}
                    api={api}
                    source={source}
                  />
                </s.ContentOnRow>
              ))}
            </div>
          </>
        )}

        {incorrectBookmarksToDisplay.length > 0 && (
          <>
            <h3>
              <br />
              😳 {strings.payMoreAttentionTo}
            </h3>
            {incorrectBookmarksToDisplay.map((each) => (
              <s.ContentOnRow className="contentOnRow" key={"row_" + each.id}>
                <Word
                  key={each.id}
                  bookmark={each}
                  notifyDelete={deleteBookmark}
                  api={api}
                  source={source}
                />
              </s.ContentOnRow>
            ))}
          </>
        )}
        <CenteredColumn className="CenteredColumn">
          <s.OrangeButton
            className="orangeButton"
            onClick={keepExercisingAction}
          >
            {strings.keepExercising}
          </s.OrangeButton>
          <s.WhiteButton className="whiteButton" onClick={backButtonAction}>
            {strings.backToReading}
          </s.WhiteButton>
        </CenteredColumn>
      </s.NarrowColumn>
    </>
  );
}
