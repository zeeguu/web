import { toast } from "react-toastify";
import { useContext } from "react";
import useFormField from "../hooks/useFormField.js";
import { APIContext } from "../contexts/APIContext";
import Modal from "./modal_shared/Modal.js";
import Form from "../pages/_pages_shared/Form.sc.js";
import ButtonContainer from "./modal_shared/ButtonContainer.sc.js";
import Button from "../pages/_pages_shared/Button.sc.js";
import Selector from "./Selector.js";
import FormSection from "../pages/_pages_shared/FormSection.sc.js";
import TextField from "./TextField.js";
import Main from "./modal_shared/Main.sc.js";
import Header from "./modal_shared/Header.sc.js";
import Heading from "./modal_shared/Heading.sc.js";
import { FEEDBACK_CODES, FEEDBACK_CODES_NAME } from "./FeedbackConstants.js";

export default function FeedbackModal({
  open,
  setOpen,
  feedbackOptions,
  prefixMsg,
}) {
  let api = useContext(APIContext);
  const [feedbackComponentSelected, setFeedbackComponentSelected] =
    useFormField(FEEDBACK_CODES_NAME.OTHER);
  const [feedbackMessage, feedbackMessageChange] = useFormField("");

  function onSubmit(e) {
    e.preventDefault();
    let payload = {
      message: prefixMsg
        ? prefixMsg + " - " + feedbackMessage
        : feedbackMessage,
      feedbackComponentId: feedbackComponentSelected,
      currentUrl: window.location.href,
    };
    api.sendFeedback(
      payload,
      () => {
        toast.success("Feedback sent!");
      },
      () => {
        toast.error("There was an error sending your message.");
      },
    );
    setOpen(false);
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
        <Form action={onSubmit}>
          <FormSection>
            <Selector
              options={feedbackOptions}
              optionLabel={(v) => FEEDBACK_CODES[v]}
              optionValue={(v) => v}
              selectedValue={feedbackComponentSelected}
              onChange={(e) => setFeedbackComponentSelected(e.target.value)}
              label={"Which component do you want to give feedback on?"}
              placeholder={"Select component to give feedback on"}
              id={"feedback-option"}
            />
          </FormSection>
          <FormSection>
            <TextField
              label={"Let us know what happened"}
              onChange={(e) => feedbackMessageChange(e.target.value)}
            />
          </FormSection>

          <ButtonContainer className={"adaptive-alignment-horizontal"}>
            <Button
              type={"submit"}
              onClick={(e) => {
                onSubmit(e);
              }}
            >
              Submit
            </Button>
          </ButtonContainer>
        </Form>
      </Main>
    </Modal>
  );
}
