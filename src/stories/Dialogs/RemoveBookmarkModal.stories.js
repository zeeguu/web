import Header from "../../components/modal_shared/Header.sc";
import Main from "../../components/modal_shared/Main.sc";
import ModalTitle from "../../components/modal_shared/ModalTitle.sc";
import ButtonContainer from "../../components/modal_shared/ButtonContainer.sc";
import Button from "../../pages/_pages_shared/Button.sc";
import Modal from "../../components/modal_shared/Modal";
import FormSection from "../../pages/_pages_shared/FormSection.sc";
import Form from "../../pages/_pages_shared/Form.sc";
import TextField from "../../components/TextField";

export default {
  title: "Dialogs/RemoveBookmarkModal",
};

export const Default = {
  render: () => (
    <Modal open={true}>
      <Header>
        <ModalTitle>Why remove learn/apprendre?</ModalTitle>
      </Header>
      <Main>
        <ButtonContainer $buttonCountNum={3}>
          <Button className="small-border-btn white-btn">I know this word</Button>
          <Button className="small-border-btn white-btn">Bad translation</Button>
          <Button className="small-border-btn white-btn">Other</Button>
        </ButtonContainer>
      </Main>
    </Modal>
  ),
};

export const OtherFeedback = {
  render: () => (
    <Modal open={true}>
      <Header>
        <ModalTitle>Why remove learn/apprendre?</ModalTitle>
      </Header>
      <Main>
        <Form>
          <FormSection>
            <TextField label="Other" placeholder="Tell us why..." />
            <ButtonContainer $buttonCountNum={2}>
              <Button className="small-border-btn">Submit</Button>
              <Button className="small-border-btn white-btn">Back</Button>
            </ButtonContainer>
          </FormSection>
        </Form>
      </Main>
    </Modal>
  ),
};
