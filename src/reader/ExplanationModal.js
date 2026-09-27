import Modal from "../components/modal_shared/Modal";
import Header from "../components/modal_shared/Header.sc";
import ModalTitle from "../components/modal_shared/ModalTitle.sc";
import Main from "../components/modal_shared/Main.sc";

/**
 * What a selected word or phrase means in the sentence it was read in.
 *
 * The translation answers "what is this in my language"; this answers "why does
 * it mean that here" -- the question a compound, an idiom or an ambiguous gloss
 * leaves open. The selection and its sentence are shown above the explanation
 * so the learner can see what was actually asked, rather than trusting that the
 * right thing was sent.
 */
export default function ExplanationModal({ open, onClose, selection, context, explanation, isLoading, error }) {
  return (
    <Modal open={open} onClose={onClose} aria-labelledby="explanation-title" aria-describedby="explanation-body">
      <Header>
        <ModalTitle id="explanation-title">{selection}</ModalTitle>
      </Header>
      <Main>
        {context && (
          <p
            style={{
              color: "var(--text-muted)",
              fontStyle: "italic",
              marginTop: 0,
              lineHeight: 1.5,
            }}
          >
            {context}
          </p>
        )}

        <div id="explanation-body">
          {isLoading && <p style={{ color: "var(--text-muted)" }}>Working it out…</p>}

          {error && !isLoading && (
            <p>
              Couldn't explain this one right now.{" "}
              <span style={{ color: "var(--text-muted)" }}>Close and tap Explain again to retry.</span>
            </p>
          )}

          {!isLoading && !error && explanation && <p style={{ lineHeight: 1.6 }}>{explanation}</p>}
        </div>

        {/* Disclosed for the same reason the summary heading says "AI summary":
            this is generated prose about a language the reader cannot yet check,
            which is exactly when they need to know where it came from. */}
        {!isLoading && !error && explanation && (
          <p style={{ color: "var(--text-muted)", fontSize: "0.85em", marginBottom: 0 }}>
            AI-generated explanation — it can be wrong.
          </p>
        )}
      </Main>
    </Modal>
  );
}
