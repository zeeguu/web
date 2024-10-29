import Word from "./Word";
import { ContentOnRow } from "../reader/ArticleReader.sc";
import strings from "../i18n/definitions";
import Infobox from "../components/Infobox";
import { useState, useEffect } from "react";
import { tokenize } from "../utils/text/preprocessing";
import ExplainBookmarkSelectionModal from "../components/ExplainBookmarkSelectionModal";
import { MAX_BOOKMARKS_TO_STUDY_PER_ARTICLE } from "../exercises/ExerciseConstants";
import { USER_WORD_PREFERENCE } from "./userBookmarkPreferences";
import InfoBoxWordsToReview from "./InfoBoxWordsToReview";
import ToggleEditReviewWords from "./ToggleEditReviewWords";

export default function WordsToReview({
  words,
  articleInfo,
  deleteBookmark,
  api,
  notifyWordChanged,
  source,
}) {
  const totalWordsTranslated = words.length;
  const [inEditMode, setInEditMode] = useState(false);
  const [wordsForExercises, setWordsForExercises] = useState([]);
  const [wordsExcludedForExercises, setWordsExcludedForExercises] = useState(
    [],
  );

  // how many of the words were set by zeeguu
  const [wordsSelectedByZeeguu_Counter, setWordsSelectedByZeeguu_Counter] =
    useState();
  const [wordsEditedByUser_Counter, setWordsEditedByUser_Counter] = useState();
  const [wordsExpressions, setWordsExpressions] = useState([]);
  const [showExplainWordSelectionModal, setShowExplainWordSelectionModal] =
    useState(false);

  useEffect(() => {
    let newWordsForExercises = [];
    let newWordsExcludedExercises = [];
    let newWordExpressions = [];

    // Keep track how many words Zeeguu selected
    let _wordsSelectedByZeeguu_Counter = 0;
    let _wordsEditedByUser_Counter = 0;

    for (let i = 0; i < words.length; i++) {
      let word = words[i];
      if (
        word.fit_for_study &&
        word.user_preference === USER_WORD_PREFERENCE.NO_PREFERENCE
      )
        _wordsSelectedByZeeguu_Counter += 1;

      if (word.user_preference !== USER_WORD_PREFERENCE.NO_PREFERENCE)
        _wordsEditedByUser_Counter += 1;

      if (tokenize(word.from).length >= 3) newWordExpressions.push(word);
      else if (!word.fit_for_study) newWordsExcludedExercises.push(word);
      else newWordsForExercises.push(word);
    }
    setWordsForExercises(newWordsForExercises);
    setWordsExcludedForExercises(newWordsExcludedExercises);
    setWordsExpressions(newWordExpressions);
    setWordsSelectedByZeeguu_Counter(_wordsSelectedByZeeguu_Counter);
    setWordsEditedByUser_Counter(_wordsEditedByUser_Counter);
  }, [words]);

  if (words.length === 0)
    return (
      <>
        {" "}
        <div style={{ marginTop: "5em" }}>
          <h1>{strings.ReviewTranslations}</h1>
          <p>
            <b>{strings.from}</b>
            {articleInfo.title}
          </p>
        </div>
        <Infobox>
          <div>
            <p>You didn't translate any words in this article.</p>
          </div>
        </Infobox>
      </>
    );

  const hasNoWordsSelected = wordsForExercises.length === 0;
  const hasZeeguuSelectWords =
    totalWordsTranslated > MAX_BOOKMARKS_TO_STUDY_PER_ARTICLE &&
    wordsEditedByUser_Counter === 0 &&
    wordsForExercises.length > 0;
  const hasUserEditedWords =
    totalWordsTranslated > MAX_BOOKMARKS_TO_STUDY_PER_ARTICLE &&
    wordsEditedByUser_Counter > 0 &&
    wordsForExercises.length > 0;

  return (
    <>
      <ExplainBookmarkSelectionModal
        open={showExplainWordSelectionModal}
        setShowExplainBookmarkSelectionModal={setShowExplainWordSelectionModal}
      ></ExplainBookmarkSelectionModal>
      <div style={{ marginTop: "5%" }}>
        <h1>{strings.ReviewTranslations}</h1>
        <p>
          <b>{strings.from}</b>
          {articleInfo.title}
        </p>
      </div>
      {(hasNoWordsSelected || hasZeeguuSelectWords || hasUserEditedWords) && (
        <InfoBoxWordsToReview
          hasZeeguuSelectWords={hasZeeguuSelectWords}
          hasUserEditedWords={hasUserEditedWords}
          hasNoWordsSelected={hasNoWordsSelected}
          wordsForExercises_Counter={wordsForExercises.length}
          wordsSelectedByZeeguu_Counter={wordsSelectedByZeeguu_Counter}
          totalWordsTranslated={totalWordsTranslated}
          showExplainWordSelectionModal={showExplainWordSelectionModal}
          setShowExplainWordSelectionModal={setShowExplainWordSelectionModal}
          toggleEditWordsComponent={
            <ToggleEditReviewWords
              setInEditMode={setInEditMode}
              inEditMode={inEditMode}
            />
          }
        />
      )}
      {wordsForExercises.length > 0 && (
        <>
          <h3>You will see these words in your exercises:</h3>
          {wordsForExercises.map((each) => (
            <ContentOnRow className="contentOnRow">
              <Word
                key={each.id}
                bookmark={each}
                notifyDelete={deleteBookmark}
                api={api}
                hideStar={true}
                notifyWordChange={notifyWordChanged}
                source={source}
                isReview={inEditMode}
              />
            </ContentOnRow>
          ))}
        </>
      )}

      {((wordsExcludedForExercises.length > 0 && totalWordsTranslated < 10) ||
        (inEditMode && wordsExcludedForExercises.length > 0)) && (
        <>
          <h3>
            You <u>won't see</u> these words in your exercises:
          </h3>
          {wordsExcludedForExercises.map((each) => (
            <ContentOnRow className="contentOnRow">
              <Word
                key={each.id}
                bookmark={each}
                notifyDelete={deleteBookmark}
                api={api}
                notifyWordChange={notifyWordChanged}
                source={source}
                isReview={inEditMode}
              />
            </ContentOnRow>
          ))}
        </>
      )}
      {((wordsExpressions.length > 0 && totalWordsTranslated < 10) ||
        (inEditMode && wordsExpressions.length > 0)) && (
        <>
          <h3>These words can't appear in exercises:</h3>
          <Infobox>
            <div>
              <p>
                <b>
                  Translations composed of 3 or more words are not used in the
                  exercises.{" "}
                </b>
              </p>
              <p>You can still review them in Words or History tab.</p>
            </div>
          </Infobox>
          {wordsExpressions.map((each) => (
            <ContentOnRow className="contentOnRow">
              <Word
                key={each.id}
                bookmark={each}
                notifyDelete={deleteBookmark}
                api={api}
                notifyWordChange={notifyWordChanged}
                source={source}
                isReview={inEditMode}
              />
            </ContentOnRow>
          ))}
        </>
      )}
    </>
  );
}
