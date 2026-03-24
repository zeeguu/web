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
import { StyledButton } from "../components/allButtons.sc.js";
import Tooltip from "@mui/material/Tooltip";
import { CenteredContent } from "../components/ColumnWidth.sc";
import MoreInfoBox from "../components/MoreInfoBox";
import { isDesktopScreenWidth } from "../components/MainNav/screenSize";
import { WordsSection, WordsListColumn, InfoBoxColumn, InfoIcon } from "./WordsToReview.sc";

export default function WordsToReview({
  words,
  articleInfo,
  deleteBookmark,
  notifyWordChanged,
  source,
  toExercises,
  exercisesEnabled,
  showMoreInfo,
  setShowMoreInfo,
}) {
  console.log("articleInfo:", articleInfo);
  const totalWordsTranslated = words.length;
  const [inEditMode, setInEditMode] = useState(false);
  const [wordsForExercises, setWordsForExercises] = useState([]);
  const [wordsExcludedForExercises, setWordsExcludedForExercises] = useState([]);
  // how many of the words were set by zeeguu
  const [wordsSelectedByZeeguu_Counter, setWordsSelectedByZeeguu_Counter] = useState();
  const [wordsEditedByUser_Counter, setWordsEditedByUser_Counter] = useState();
  const [wordsExpressions, setWordsExpressions] = useState([]);
  const [showExplainWordSelectionModal, setShowExplainWordSelectionModal] = useState(false);

  useEffect(() => {
    let newWordsForExercises = [];
    let newWordsExcludedExercises = [];
    let newWordExpressions = [];

    // Keep track how many words Zeeguu selected
    let _wordsSelectedByZeeguu_Counter = 0;
    let _wordsEditedByUser_Counter = 0;

    for (let i = 0; i < words.length; i++) {
      let word = words[i];
      if (word.fit_for_study && word.user_preference === USER_WORD_PREFERENCE.NO_PREFERENCE)
        _wordsSelectedByZeeguu_Counter += 1;

      if (word.user_preference !== USER_WORD_PREFERENCE.NO_PREFERENCE) _wordsEditedByUser_Counter += 1;

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
          toggleEditWordsComponent={<ToggleEditReviewWords setInEditMode={setInEditMode} inEditMode={inEditMode} />}
        />
      )}
      {wordsForExercises.length > 0 && (
        <WordsSection>
          <WordsListColumn>
            <h3
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: "0.3rem",
                margin: "0",
                marginBottom: "0.5rem",
                marginTop: "0.5rem",
              }}
            >
              You might see these words in your exercises:
              <InfoIcon
                onClick={() => setShowMoreInfo(showMoreInfo === "willBeInExercises" ? null : "willBeInExercises")}
              />
            </h3>
            {wordsForExercises.map((each) => (
              <ContentOnRow className="contentOnRow" key={each.id}>
                <Word
                  bookmark={each}
                  notifyDelete={deleteBookmark}
                  hideStar={true}
                  notifyWordChange={notifyWordChanged}
                  source={source}
                  isReview={inEditMode}
                  hideLevelIndicator={true}
                />
              </ContentOnRow>
            ))}
          </WordsListColumn>
          <InfoBoxColumn>
            {showMoreInfo === "willBeInExercises" && <MoreInfoBox type="willBeInExercises" />}
          </InfoBoxColumn>
        </WordsSection>
      )}
      <CenteredContent style={{ marginBottom: "2em" }}>
        {!exercisesEnabled ? (
          <Tooltip title="You need to translate words in the article first." arrow>
            <span>
              <StyledButton disabled>{strings.toPracticeWords}</StyledButton>
            </span>
          </Tooltip>
        ) : (
          <StyledButton navigation onClick={toExercises}>
            {strings.toPracticeWords}
          </StyledButton>
        )}
      </CenteredContent>
      {((wordsExcludedForExercises.length > 0 && totalWordsTranslated < 10) ||
        (wordsExpressions.length > 0 && totalWordsTranslated < 10) ||
        (inEditMode && wordsExcludedForExercises.length > 0) ||
        (inEditMode && wordsExpressions.length > 0)) && (
        <WordsSection>
          <WordsListColumn>
            <h3
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: "0.3rem",
                margin: "0",
                marginBottom: "0.5rem",
                marginTop: "0.5rem",
              }}
            >
              You won't see these words in your exercises:
              <InfoIcon
                onClick={() => setShowMoreInfo(showMoreInfo === "wontBeInExercises" ? null : "wontBeInExercises")}
              />
            </h3>
            {wordsExcludedForExercises.map((each) => (
              <ContentOnRow className="contentOnRow" key={each.id}>
                <Word
                  bookmark={each}
                  notifyDelete={deleteBookmark}
                  notifyWordChange={notifyWordChanged}
                  source={source}
                  isReview={inEditMode}
                  hideLevelIndicator={true}
                />
              </ContentOnRow>
            ))}
            {((wordsExpressions.length > 0 && totalWordsTranslated < 10) ||
              (inEditMode && wordsExpressions.length > 0)) && (
              <>
                {wordsExpressions.map((each) => (
                  <ContentOnRow className="contentOnRow" key={each.id}>
                    <Word
                      bookmark={each}
                      notifyDelete={deleteBookmark}
                      notifyWordChange={notifyWordChanged}
                      source={source}
                      isReview={inEditMode}
                    />
                  </ContentOnRow>
                ))}
              </>
            )}
          </WordsListColumn>
          <InfoBoxColumn>
            {showMoreInfo === "wontBeInExercises" && <MoreInfoBox type="wontBeInExercises" />}
          </InfoBoxColumn>
        </WordsSection>
      )}
    </>
  );
}
