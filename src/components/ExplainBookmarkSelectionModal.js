import Modal from "../components/modal_shared/Modal";
import Header from "../components/modal_shared/Header";
import Heading from "../components/modal_shared/Heading";
import { Main } from "../components/modal_shared/Main.sc";
import { APP_DOMAIN } from "../appConstants";
import { MAX_BOOKMARKS_TO_STUDY_PER_ARTICLE } from "../exercises/ExerciseConstants";

export default function ExplainBookmarkSelectionModal({
  open,
  setShowExplainBookmarkSelectionModal,
}) {
  function handleClose() {
    setShowExplainBookmarkSelectionModal(false);
  }

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Header>
        <p style={{ textAlign: "center" }}>
          {" "}
          <img
            style={{ height: "2em" }}
            src={APP_DOMAIN + "/static/icons/" + "info-icon.png"}
            alt=""
          />
        </p>

        <Heading>How Zeeguu Selects Words to Practice</Heading>
      </Header>
      <Main>
        <p>
          When you translate more than{" "}
          <b>{MAX_BOOKMARKS_TO_STUDY_PER_ARTICLE}</b> bookmarks Zeeguu
          prioritizes bookmarks based on how common they are in the language you
          are learning.
        </p>
        <p>
          We do this to ensure that you focus on words that you are more likely
          to encounter in new texts.
        </p>
        <p>
          Zeeguu remembers any words you add or remove manually, and you will
          see them in the exercises according to your preferences.
        </p>
      </Main>
    </Modal>
  );
}
