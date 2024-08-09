import Word from "../words/Word";
import * as s from "../reader/ArticleReader.sc";
import strings from "../i18n/definitions";
import { useState, useEffect, useContext } from "react";
import { CenteredColumn } from "./Congratulations.sc";
import { removeArrayDuplicates } from "../utils/basic/arrays";
import { LoadingAnimation } from "../components/LoadingAnimation.sc";
import LocalStorage from "../assorted/LocalStorage";
import { timeToHumanReadable } from "../utils/misc/readableTime";
import { ExerciseCountContext } from "./ExerciseCountContext";
import CollapsablePanel from "../components/CollapsablePanel";

export default function Congratulations({
  articleID,
  isAbleToAddBookmarksToPipe,
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
  const exerciseNotification = useContext(ExerciseCountContext);
  const [correctBookmarksToDisplay, setCorrectBookmarksToDisplay] = useState(
    removeArrayDuplicates(correctBookmarks),
  );
  const [incorrectBookmarksToDisplay, setIncorrectBookmarksToDisplay] =
    useState(removeArrayDuplicates(incorrectBookmarks));
  const [totalBookmarksReviewed, setTotalBookmarksReviewed] = useState();
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
    setTotalBookmarksReviewed(
      incorrectBookmarksToDisplay.length + correctBookmarksToDisplay.length,
    );
    api.logUserActivity(api.COMPLETED_EXERCISES, articleID, "", source);
  }, []);

  if (username === undefined) {
    return <LoadingAnimation />;
  }
  const isPlural = totalBookmarksReviewed > 1;
  const isThereMoreExercises =
    exerciseNotification.exerciseCounter > 0 || isAbleToAddBookmarksToPipe;
  return (
    <>
      <s.NarrowColumn className="narrowColumn">
        <br />
        <CenteredColumn className="centeredColumn">
          <h1>
            {strings.goodJob} {username}!
          </h1>
        </CenteredColumn>
        <div style={{ marginLeft: "0.5em" }}>
          <p>
            You have just reviewed <b>{totalBookmarksReviewed}</b>{" "}
            {isPlural ? "words" : "word"}!{" "}
          </p>
          {isAbleToAddBookmarksToPipe &&
            !articleID &&
            exerciseNotification.exerciseCounter === 0 && (
              <p>
                You can start studying new words, do you want to continue
                exercising?
              </p>
            )}
          {!isThereMoreExercises && (
            <p>
              There are no more words for you to practice. You can read more
              articles and find new words to learn!
            </p>
          )}
        </div>
        {isThereMoreExercises ? (
          <CenteredColumn
            className="CenteredColumn"
            style={{ marginTop: "2em" }}
          >
            <s.OrangeButton
              className="orangeButton"
              onClick={keepExercisingAction}
            >
              {strings.keepExercising}
            </s.OrangeButton>
          </CenteredColumn>
        ) : (
          <s.WhiteButton className="whiteButton" onClick={backButtonAction}>
            {strings.backToReading}
          </s.WhiteButton>
        )}
        <div style={{ marginTop: "1em", fontSize: "small" }}>
          You have been exercising for {timeToHumanReadable(totalTime)}
        </div>
        {articleID && (
          <p>
            You practiced words from: <a href={articleURL}>{articleTitle}</a>
          </p>
        )}

        <br />
        {incorrectBookmarksToDisplay.length > 0 && (
          <CollapsablePanel
            children={incorrectBookmarksToDisplay.map((each) => (
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
            topMessage={strings.wordsYoullRepeat}
            defaultOpen={true}
          ></CollapsablePanel>
        )}
        <br />
        {correctBookmarksToDisplay.length > 0 && (
          <CollapsablePanel
            children={correctBookmarksToDisplay.map((each) => (
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
            topMessage={strings.wordsYouProgress}
            defaultOpen={true}
          ></CollapsablePanel>
        )}
      </s.NarrowColumn>
    </>
  );
}
