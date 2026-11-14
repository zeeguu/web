import { useEffect, useState } from "react";
import Modal from "../components/modal_shared/Modal";
import Main from "../components/modal_shared/Main.sc";
import Header from "../components/modal_shared/Header.sc";
import ModalTitle from "../components/modal_shared/ModalTitle.sc";
import ButtonContainer from "../components/modal_shared/ButtonContainer.sc";
import Form from "../pages/_pages_shared/Form.sc";
import FormSection from "../pages/_pages_shared/FormSection.sc";
import Button from "../pages/_pages_shared/Button.sc";
import InputField from "../components/InputField";
import strings from "../i18n/definitions";

// Asks for one keyword for the Evergreen tab, in the app's own modal (the
// same parts as FeedbackModal) rather than a browser-style prompt.
export default function AddKeywordModal({ open, onClose, onAdd }) {
  const [keyword, setKeyword] = useState("");

  // Start empty every time it opens.
  useEffect(() => {
    if (open) setKeyword("");
  }, [open]);

  function submit(e) {
    e.preventDefault();
    const trimmed = keyword.trim();
    if (!trimmed) return;
    onAdd(trimmed);
  }

  return (
    <Modal open={open} onClose={onClose}>
      <Main>
        <Header withoutLogo>
          <ModalTitle>{strings.evergreenAddKeywordPrompt}</ModalTitle>
        </Header>
        <Form onSubmit={submit}>
          <FormSection>
            <InputField
              type="text"
              id="evergreen-keyword"
              name="keyword"
              label={strings.evergreenAddKeyword}
              placeholder={strings.evergreenKeywordPlaceholder}
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              autoFocus
              autoComplete="off"
            />
          </FormSection>
          <ButtonContainer $buttonCountNum={2}>
            <Button type="submit" disabled={!keyword.trim()}>
              {strings.evergreenAdd}
            </Button>
            <Button type="button" className="grey" onClick={onClose}>
              {strings.cancel}
            </Button>
          </ButtonContainer>
        </Form>
      </Main>
    </Modal>
  );
}
