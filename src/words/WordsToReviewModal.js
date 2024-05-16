import Word from "./Word";
import { ContentOnRow } from "../reader/ArticleReader.sc";
import strings from "../i18n/definitions";
import Infobox from "../components/Infobox";
import { useState } from "react";
import { useEffect } from "react";
import { tokenize } from "../utils/preprocessing/preprocessing";
import Modal from "../components/modal_shared/Modal";
import { EditWordsToExerciseButton } from "./WordsToReview.sc";

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
      <div style={{ marginTop: "5em" }}>
        <h1>{strings.ReviewTranslations}</h1>
        <medium>
          <b>{strings.from}</b>
          {articleInfo.title}
        </medium>
      </div>
      {totalWordsTranslated > 10 && (
        <>
          <Infobox>
            <div>
              <p>
                You have translated <b>{totalWordsTranslated}</b> words in this
                text.
              </p>
              <p>
                Zeeguu selects the <b>top 10</b> words to add to your exercises
                based on{" "}
                <b>how common they are in the language you are learning.</b>
              </p>
              <p>
                If you want to{" "}
                <b>
                  manually add or remove words, use the button "Manage Words"
                </b>{" "}
                below.
              </p>
            </div>
          </Infobox>
        </>
      )}
      <h3>You will see these words in your exercises 📖 :</h3>
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
          />
        </ContentOnRow>
      ))}
      {inEditMode && (
        <>
          <Modal
            open={inEditMode}
            onClose={() => {
              setInEditMode(!inEditMode);
            }}
          >
            <h3>You will see these words in your exercises 📖 :</h3>
            {wordsForExercises.map((each) => (
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
            ))}
            {inEditMode && wordsExcludedForExercises.length > 0 && (
              <>
                <h3>You won't see these words in your exercises:</h3>
                {wordsExcludedForExercises.map((each) => (
                  <Word
                    key={each.id}
                    bookmark={each}
                    notifyDelete={deleteBookmark}
                    api={api}
                    notifyWordChange={notifyWordChanged}
                    source={source}
                    isReview={inEditMode}
                  />
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
                        Translations composed of 3 or more words are not used in
                        the exercises.{" "}
                      </b>
                      <p>You can still review them in Words or History tab.</p>
                    </p>
                  </div>
                </Infobox>
                {wordsExpressions.map((each) => (
                  <Word
                    key={each.id}
                    bookmark={each}
                    notifyDelete={deleteBookmark}
                    api={api}
                    notifyWordChange={notifyWordChanged}
                    source={source}
                    isReview={inEditMode}
                  />
                ))}
              </>
            )}
          </Modal>
        </>
      )}
      {totalWordsTranslated > 10 && (
        <div
          style={{
            display: "flex",
            maxWidth: "90%",
            flexDirection: "column",
            alignItems: "flex-end",
          }}
        >
          {" "}
          <EditWordsToExerciseButton
            onClick={() => {
              setInEditMode(!inEditMode);
            }}
          >
            <span>Manage Words</span>
          </EditWordsToExerciseButton>
        </div>
      )}
    </>
  );
}
