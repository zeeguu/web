import { useContext, useRef, useState } from "react";
import { APIContext } from "../../contexts/APIContext";
import ExplanationModal from "../../reader/ExplanationModal";
import * as s from "./Exercise.sc";
import { explanationCefr } from "../../utils/misc/userCefrLevel";

/**
 * Explain for the word being practiced, the same Explain the reader offers.
 *
 * The exercise shows the bookmark's translation as if it were the word's
 * meaning, but it is the meaning in one sentence: "noget" saved as "one" from
 * "noget af det mest ekstreme". This is where the learner meets that gloss
 * again, out of the reading that made sense of it, so this is where they need
 * to ask why.
 */
export default function ExplainWordButton({ bookmark }) {
  const api = useContext(APIContext);
  const [explanation, setExplanation] = useState(null);

  // Same guard as the reader: closing the modal while the request is still
  // running must not let a late answer reopen it.
  const requestRef = useRef(0);

  if (!bookmark?.context) return null;

  function explain() {
    const token = ++requestRef.current;
    const isStale = () => requestRef.current !== token;
    const selection = bookmark.from;
    const context = bookmark.context;

    setExplanation({ selection, context, text: null, isLoading: true, error: false });
    api.logUserActivity(
      api.EXPLAIN_SELECTION,
      null,
      selection,
      JSON.stringify({ source: "exercise", bookmark_id: bookmark.id }),
    );

    api
      .explainSelection(
        bookmark.from_lang,
        bookmark.to_lang,
        selection,
        context,
        explanationCefr(localStorage.learned_cefr_level),
      )
      .then((result) => {
        if (isStale()) return;
        if (!result?.explanation) {
          setExplanation((e) => ({ ...e, isLoading: false, error: true }));
          return;
        }
        setExplanation((e) => ({ ...e, text: result.explanation, isLoading: false }));
      })
      .catch(() => {
        if (isStale()) return;
        setExplanation((e) => ({ ...e, isLoading: false, error: true }));
      });
  }

  function close() {
    requestRef.current++; // abandon whatever is still in flight
    setExplanation(null);
  }

  return (
    <>
      <s.StyledGreyButton className="styledGreyButton" onClick={explain}>
        Explain
      </s.StyledGreyButton>
      {explanation && (
        <ExplanationModal
          open={true}
          onClose={close}
          selection={explanation.selection}
          context={explanation.context}
          explanation={explanation.text}
          isLoading={explanation.isLoading}
          error={explanation.error}
        />
      )}
    </>
  );
}
