import * as s from "../../exercises/replaceExample/ReplaceExampleModal.sc";

export default {
  title: "Dialogs/ReplaceExampleModal",
};

export const Default = {
  render: () => (
    <s.ModalOverlay>
      <s.ModalContent>
        <s.ModalHeader>
          <h3>Replace Example</h3>
          <s.CloseButton>×</s.CloseButton>
        </s.ModalHeader>

        <s.ModalBody>
          <s.SectionLabel>Available Examples</s.SectionLabel>
          <s.ExamplesContainer>
            <s.ExampleOption>
              <s.SentenceText>"I have been learning for years"</s.SentenceText>
              <s.TranslationText>Jeg har været ved at lære i årevis</s.TranslationText>
              <s.LevelBadge>B2</s.LevelBadge>
            </s.ExampleOption>

            <s.ExampleOption $selected>
              <s.SentenceText>"We are studying hard"</s.SentenceText>
              <s.TranslationText>Vi studerer hårdt</s.TranslationText>
              <s.LevelBadge>A2</s.LevelBadge>
            </s.ExampleOption>

            <s.ExampleOption>
              <s.SentenceText>"They have finished the project"</s.SentenceText>
              <s.TranslationText>De har afsluttet projektet</s.TranslationText>
              <s.LevelBadge>B1</s.LevelBadge>
            </s.ExampleOption>
          </s.ExamplesContainer>
        </s.ModalBody>

        <s.ModalFooter>
          <s.CancelButton>Cancel</s.CancelButton>
          <s.SaveButton>Save</s.SaveButton>
        </s.ModalFooter>
      </s.ModalContent>
    </s.ModalOverlay>
  ),
};

export const Loading = {
  render: () => (
    <s.ModalOverlay>
      <s.ModalContent>
        <s.ModalHeader>
          <h3>Replace Example</h3>
          <s.CloseButton>×</s.CloseButton>
        </s.ModalHeader>

        <s.ModalBody>
          <s.LoadingContainer>
            <div>Loading...</div>
            <p>Finding alternative examples</p>
          </s.LoadingContainer>
        </s.ModalBody>
      </s.ModalContent>
    </s.ModalOverlay>
  ),
};

export const Empty = {
  render: () => (
    <s.ModalOverlay>
      <s.ModalContent>
        <s.ModalHeader>
          <h3>Replace Example</h3>
          <s.CloseButton>×</s.CloseButton>
        </s.ModalHeader>

        <s.ModalBody>
          <s.EmptyState>No alternative examples available for this word.</s.EmptyState>
        </s.ModalBody>

        <s.ModalFooter>
          <s.CancelButton>Close</s.CancelButton>
        </s.ModalFooter>
      </s.ModalContent>
    </s.ModalOverlay>
  ),
};
