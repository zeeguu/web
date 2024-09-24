import { toast } from "react-toastify";
import { useEffect, useState, useContext } from "react";
import { setTitle } from "../assorted/setTitle";
import useFormField from "../hooks/useFormField";
import strings from "../i18n/definitions";
import Modal from "../components/modal_shared/Modal.js";
import Form from "../pages/_pages_shared/Form.js";
import ButtonContainer from "../components/modal_shared/ButtonContainer.js";
import Button from "../pages/_pages_shared/Button.js";
import Selector from "../components/Selector.js";
import FormSection from "../pages/_pages_shared/FormSection.js";
import TextField from "../components/TextField.js";
import Main from "../components/modal_shared/Main.js";
import Header from "../components/modal_shared/Header.js";
import Heading from "../components/modal_shared/Heading.js";

export default function GiveFeedbackModal({ api, open, setOpen }) {
  const feedbackOptions = [
    "Article Recommendations",
    "Article Reader",
    "Translations",
    "Sound",
    "Exercises",
    "Extension",
    "Other",
  ];

  const [feedbackTypeSelection, feedbackTypeSelectionChange] = useFormField(
    feedbackOptions[0],
  );
  const [feedbackMessage, feedbackMessageChange] = useFormField("");

  useEffect(() => {
    setTitle(strings.feedbackTab);
    // eslint-disable-next-line
  }, []);

  function onSubmit() {
    api.sendFeedback(feedbackMessage, feedbackTypeSelection);
  }

  return (
    <Modal
      open={open}
      onClose={() => {
        setOpen(false);
      }}
    >
      <Main>
        <Header withoutLogo>
          <Heading>Provide Feedback</Heading>
        </Header>
        <Form>
          <FormSection>
            <Selector
              options={feedbackOptions}
              optionLabel={(v) => {
                return v;
              }}
              optionValue={(v) => {
                return v;
              }}
              selectedValue={feedbackTypeSelection}
              onChange={(e) => feedbackTypeSelectionChange(e)}
              label={"Which component do you want to give feedback on?"}
              placeholder={"Select Component to give Feedback on"}
              id={"feedback-option"}
            />
          </FormSection>
          <FormSection>
            <TextField label={"Let us know what happened"} />
          </FormSection>

          <ButtonContainer className={"adaptive-alignment-horizontal"}>
            <Button type={"submit"}>Submit</Button>
          </ButtonContainer>
        </Form>
      </Main>
    </Modal>
  );
}
