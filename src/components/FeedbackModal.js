import { toast } from "react-toastify";
import { useContext, useEffect } from "react";
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
  componentCategories,
  preselectedCategory,
  prefixMsg,
  contextualInfo,
}) {
  let api = useContext(APIContext);

  // Smart preselection: explicit choice > intelligent context-based > first available > Other
  const getDefaultOption = () => {
    // 1. If explicitly specified, use that
    if (preselectedCategory && componentCategories?.includes(preselectedCategory)) {
      return preselectedCategory;
    }

    // 2. Intelligent preselection based on current page URL
    const currentUrl = contextualInfo?.url || window.location.href;
    console.log("FeedbackModal Debug:", {
      currentUrl,
      componentCategories,
      exerciseCodeName: FEEDBACK_CODES_NAME.EXERCISE,
      includesExercise: componentCategories?.includes(FEEDBACK_CODES_NAME.EXERCISE)
    });
    if (currentUrl.includes("/exercise") || currentUrl.includes("/exercises")) {
      return componentCategories?.includes(FEEDBACK_CODES_NAME.EXERCISE)
        ? FEEDBACK_CODES_NAME.EXERCISE
        : FEEDBACK_CODES_NAME.OTHER;
    }
    if (currentUrl.includes("/read/article")) {
      return componentCategories?.includes(FEEDBACK_CODES_NAME.ARTICLE_READER)
        ? FEEDBACK_CODES_NAME.ARTICLE_READER
        : FEEDBACK_CODES_NAME.OTHER;
    }
    if (currentUrl.includes("/daily-audio")) {
      return componentCategories?.includes(FEEDBACK_CODES_NAME.DAILY_AUDIO)
        ? FEEDBACK_CODES_NAME.DAILY_AUDIO
        : FEEDBACK_CODES_NAME.OTHER;
    }

    // 3. Default to "Other" for any unrecognized page
    return FEEDBACK_CODES_NAME.OTHER;
  };

  const defaultOption = getDefaultOption();
  const [feedbackComponentSelected, setFeedbackComponentSelected] = useFormField(defaultOption);
  const [feedbackMessage, feedbackMessageChange] = useFormField("");

  // Reset form fields when modal opens or context changes
  useEffect(() => {
    if (open) {
      setFeedbackComponentSelected(defaultOption);
      feedbackMessageChange("");
    }
  }, [open, defaultOption, setFeedbackComponentSelected, feedbackMessageChange]);

  function onSubmit(e) {
    e.preventDefault();
    let payload = {
      message: prefixMsg ? prefixMsg + " - " + feedbackMessage : feedbackMessage,
      feedbackComponentId: feedbackComponentSelected,
      currentUrl: contextualInfo?.url || window.location.href,
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
              options={componentCategories}
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
              autoFocus={open}
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
