import Word from "./Word";
import { ContentOnRow } from "../reader/ArticleReader.sc";
import strings from "../i18n/definitions";
import Infobox from "../components/Infobox";
import { useState, useEffect } from "react";
import { tokenize } from "../utils/text/preprocessing";
import ToggleEditReviewWords from "./ToggleEditReviewWords";
import { StyledButton } from "../components/allButtons.sc.js";
import Tooltip from "@mui/material/Tooltip";
import { CenteredContent } from "../components/ColumnWidth.sc";
import MoreInfoBox from "../components/MoreInfoBox";
import {
  WordsSection,
  WordsListColumn,
  InfoBoxColumn,
  InfoIcon,
  SectionHeading,
  ToggleContainer,
} from "./WordsToReview.sc";

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
  const [inEditMode, setInEditMode] = useState(false);
  const [wordsForExercises, setWordsForExercises] = useState([]);
  const [wordsExcludedForExercises, setWordsExcludedForExercises] = useState([]);
  const [wordsExpressions, setWordsExpressions] = useState([]);
  useEffect(() => {
    let newWordsForExercises = [];
    let newWordsExcludedExercises = [];
    let newWordExpressions = [];

    for (let i = 0; i < words.length; i++) {
      let word = words[i];

      if (tokenize(word.from).length >= 3) newWordExpressions.push(word);
      else if (!word.fit_for_study) newWordsExcludedExercises.push(word);
      else newWordsForExercises.push(word);
    }
    setWordsForExercises(newWordsForExercises);
    setWordsExcludedForExercises(newWordsExcludedExercises);
    setWordsExpressions(newWordExpressions);
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

  return (
    <>
      <div style={{ marginTop: "5%" }}>
        <h1>{strings.ReviewTranslations}</h1>
        <p>
          <b>{strings.from}</b>
          {articleInfo.title}
        </p>
      </div>
      <ToggleContainer>
        <ToggleEditReviewWords setInEditMode={setInEditMode} inEditMode={inEditMode} />
      </ToggleContainer>
      {wordsForExercises.length > 0 && (
        <WordsSection>
          <WordsListColumn>
            <SectionHeading>
              Will eventually appear in exercises
              <InfoIcon
                onClick={() => setShowMoreInfo(showMoreInfo === "howWordsAreAdded" ? null : "howWordsAreAdded")}
              />{" "}
            </SectionHeading>
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
            {showMoreInfo === "howWordsAreAdded" && <MoreInfoBox type="howWordsAreAdded" />}
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
      {(wordsExcludedForExercises.length > 0 || wordsExpressions.length > 0) && (
        <WordsSection>
          <WordsListColumn>
            <SectionHeading>
              Not included in exercises
              <InfoIcon
                onClick={() => setShowMoreInfo(showMoreInfo === "wontBeInExercises" ? null : "wontBeInExercises")}
              />
            </SectionHeading>
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
            {wordsExpressions.length > 0 && (
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
