import { useState, useContext } from "react";
import Modal from "@mui/material/Modal";
import * as s from "./WordEdit.sc";
import { ModalWrapper } from "../components/modal_shared/Modal.sc";
import { FeedbackSubmit, FeedbackCancel, FeedbackButton } from "../exercises/bottomActions/FeedbackButtons.sc";
import FullWidthErrorMsg from "../components/FullWidthErrorMsg.sc";
import { APIContext } from "../contexts/APIContext";
import { UserContext } from "../contexts/UserContext";
import LoadingAnimation from "../components/LoadingAnimation";
import { StyledGreyButton } from "../exercises/exerciseTypes/Exercise.sc";

export default function AddCustomWordModal({ onClose, onSuccess }) {
  const api = useContext(APIContext);
  const user = useContext(UserContext);

  const [word, setWord] = useState("");
  const [translation, setTranslation] = useState("");
  const [context, setContext] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isGeneratingContext, setIsGeneratingContext] = useState(false);
  const [generatedExamples, setGeneratedExamples] = useState([]);
  const [showExamples, setShowExamples] = useState(false);

  const fromLang = user.userDetails?.learned_language;
  const toLang = user.userDetails?.native_language;

  console.log("Languages:", { fromLang, toLang });

  function handleSubmit(event) {
    event.preventDefault();
    console.log("handle submit");

    let validators = [
      [word.trim(), "Word"],
      [translation.trim(), "Translation"],
      [context.trim(), "Context"],
    ];

    console.log(validators);

    for (let validator of validators) {
      console.log(validator);
      if (!validator[0]) {
        setErrorMessage(` ${validator[1]} is required`);
        return;
      }
    }

    // Validate required fields
    if (!word.trim() || !translation.trim() || !context.trim()) {
      setErrorMessage("Word, translation, and context are required");
      return;
    }

    if (!word.trim() || !translation.trim() || !context.trim()) {
      setErrorMessage("Word, translation, and context are required");
      return;
    }

    setIsLoading(true);
    setErrorMessage("");

    // Call the API to add custom word
    console.log("Sending to API:", {
      word: word.trim(),
      translation: translation.trim(),
      fromLang,
      toLang,
      context: context.trim(),
    });

    api.addCustomWord(
      word.trim(),
      translation.trim(),
      fromLang,
      toLang,
      context.trim(),
      (result) => {
        setIsLoading(false);
        console.log("Custom word added successfully:", result);
        onSuccess();
      },
      (error) => {
        setIsLoading(false);
        setErrorMessage("Failed to add word. Please try again.");
      },
    );
  }

  function handleCancel() {
    setWord("");
    setTranslation("");
    setContext("");
    setErrorMessage("");
    setGeneratedExamples([]);
    setShowExamples(false);
    onClose();
  }

  function handleGenerateContext() {
    if (!word.trim() || !translation.trim()) {
      setErrorMessage("Please enter a word/translation pair first");
      return;
    }

    setIsGeneratingContext(true);
    setErrorMessage("");

    // Call API to generate examples
    api.getGeneratedExamples(
      word.trim(),
      fromLang,
      toLang,
      (result) => {
        setIsGeneratingContext(false);
        if (result && result.length > 0) {
          setGeneratedExamples(result);
          setShowExamples(true);
        } else {
          setErrorMessage("No examples could be generated for this word");
        }
      },
      (error) => {
        setIsGeneratingContext(false);
        setErrorMessage("Failed to generate examples. Please try again.");
      },
    );
  }

  function handleSelectExample(example) {
    setContext(example);
    setShowExamples(false);
  }

  return (
    <Modal open={true} onClose={handleCancel}>
      <ModalWrapper>
        <s.Headline>Manually Add New Word</s.Headline>

        {isLoading ? (
          <LoadingAnimation />
        ) : (
          <form onSubmit={handleSubmit} autoFocus={true}>
            {errorMessage && <FullWidthErrorMsg>{errorMessage}</FullWidthErrorMsg>}

            <s.CustomTextField
              id="word-input"
              label="Word/Expression"
              placeholder="e.g., jo tidligere, jo bedre"
              variant="outlined"
              fullWidth
              value={word}
              onChange={(e) => setWord(e.target.value)}
              autoFocus
            />

            <s.CustomTextField
              id="translation-input"
              label="Translation"
              placeholder="e.g., the sooner, the better"
              variant="outlined"
              fullWidth
              value={translation}
              onChange={(e) => setTranslation(e.target.value)}
            />

            <s.ExampleFieldContainer>
              <s.CustomTextField
                id="context-input"
                label="Example sentence"
                placeholder="Enter an example sentence using this word; it will be used in exercises"
                variant="outlined"
                fullWidth
                multiline
                rows={3}
                value={context}
                onChange={(e) => setContext(e.target.value)}
              />
            </s.ExampleFieldContainer>

            {showExamples && generatedExamples.length > 0 && (
              <s.ExamplesContainer>
                <s.ExamplesHeading>Select an example:</s.ExamplesHeading>
                {generatedExamples.map((example, index) => (
                  <s.ExampleOption key={index} onClick={() => handleSelectExample(example)}>
                    {example}
                  </s.ExampleOption>
                ))}
                <s.ExampleOption onClick={() => setShowExamples(false)} style={{ fontStyle: "italic", color: "#666" }}>
                  Cancel - I'll write my own
                </s.ExampleOption>
              </s.ExamplesContainer>
            )}

            <s.HelpText>
              The word will be immediately added to your learning queue and will appear in exercises.
            </s.HelpText>

            <s.ButtonContainer>
              <FeedbackCancel type="button" onClick={handleCancel} value="Cancel" />

              <FeedbackSubmit type="submit" value="Add Word" />
            </s.ButtonContainer>
          </form>
        )}
      </ModalWrapper>
    </Modal>
  );
}
