import Word from "./Word";
import { ContentOnRow } from "../reader/ArticleReader.sc";
import strings from "../i18n/definitions";
import Infobox from "../components/Infobox";
import { useState } from "react";
import { useEffect } from "react";
import { tokenize } from "../utils/preprocessing/preprocessing";
import { t, Android12Switch } from "../components/MUIToggleThemes";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import { ThemeProvider } from "@mui/material/styles";
import ExplainBookmarkSelectionModal from "../components/ExplainBookmarkSelectionModal";
import { MAX_BOOKMARKS_PER_ARTILE } from "../exercises/ExerciseConstants";

export default function WordsToReview({
  words,
  articleInfo,
  deleteBookmark,
  api,
  notifyWordChanged,
  source,
}) {
  console.log(words.length);
  const totalWordsTranslated = words.length;
  const [inEditMode, setInEditMode] = useState(false);
  const [wordsForExercises, setWordsForExercises] = useState([]);
  const [wordsExcludedForExercises, setWordsExcludedForExercises] = useState(
    [],
  );
  const [wordsExpressions, setWordsExpressions] = useState([]);
  const [showExplainWordSelectionModal, setShowExplainWordSelectionModal] =
    useState(false);

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
          <medium>
            <b>{strings.from}</b>
            {articleInfo.title}
          </medium>
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
      <ExplainBookmarkSelectionModal
        open={showExplainWordSelectionModal}
        setShowExplainBookmarkSelectionModal={setShowExplainWordSelectionModal}
      ></ExplainBookmarkSelectionModal>
      <div style={{ marginTop: "5%" }}>
        <h1>{strings.ReviewTranslations}</h1>
        <medium>
          <b>{strings.from}</b>
          {articleInfo.title}
        </medium>
      </div>
      {totalWordsTranslated > MAX_BOOKMARKS_PER_ARTILE && (
        <>
          <Infobox>
            <div>
              <p>
                We have selected{" "}
                <b>
                  {wordsForExercises.length} out of {totalWordsTranslated}{" "}
                  translated words for you to practice.{" "}
                </b>
                <a
                  onClick={() => {
                    console.log("Setting! " + showExplainWordSelectionModal);
                    setShowExplainWordSelectionModal(
                      !showExplainWordSelectionModal,
                    );
                  }}
                >
                  Tell me why these words are selected
                </a>
                .
              </p>
              <p>
                <b>To manually add or remove words, use the toggle below.</b>
              </p>
              <ThemeProvider theme={t} style={{ marginBottom: "-1em" }}>
                <FormGroup>
                  <FormControlLabel
                    control={<Android12Switch />}
                    className={inEditMode ? "selected" : ""}
                    onClick={(e) => setInEditMode(!inEditMode)}
                    label={
                      <medium style={{ fontWeight: "500" }}>
                        {"Manage Words for Exercises"}
                      </medium>
                    }
                  />
                </FormGroup>
              </ThemeProvider>
            </div>
          </Infobox>
        </>
      )}
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
      {inEditMode && wordsExcludedForExercises.length > 0 && (
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
      {inEditMode && wordsExpressions.length > 0 && (
        <>
          <h3>These words can't appear in exercises:</h3>
          <Infobox>
            <div>
              <p>
                <b>
                  Translations composed of 3 or more words are not used in the
                  exercises.{" "}
                </b>
                <p>You can still review them in Words or History tab.</p>
              </p>
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
