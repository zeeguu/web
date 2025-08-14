import Modal from "../../components/modal_shared/Modal";
import Header from "../../components/modal_shared/Header.sc";
import Main from "../../components/modal_shared/Main.sc";
import Heading from "../../components/modal_shared/Heading.sc";
import ButtonContainer from "../../components/modal_shared/ButtonContainer.sc";
import Button from "../../pages/_pages_shared/Button.sc";
import TextField from "../../components/TextField";
import FormSection from "../../pages/_pages_shared/FormSection.sc";
import Form from "../../pages/_pages_shared/Form.sc";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

export default function RemoveBookmarkModal({
  exerciseBookmarks,
  open,
  setOpen,
  uploadUserFeedback,
  setHasProvidedQuickFeedback,
}) {
  const [showOtherForm, setShowOtherForm] = useState(false);
  const [otherFeedback, setOtherFeedback] = useState("");
  const [exerciseBookmarkForFeedback, setExerciseBookmarkForFeedback] = useState(null);

  useEffect(() => {
    if (exerciseBookmarks && exerciseBookmarks.length > 0) {
      setExerciseBookmarkForFeedback(exerciseBookmarks[0]);
    }
  }, [exerciseBookmarks]);

  // Reset form state when modal opens
  useEffect(() => {
    if (open) {
      setShowOtherForm(false);
      setOtherFeedback("");
    }
  }, [open]);

  const possibleReasons = [
    ["too_easy", "Too easy"],
    ["learned_already", "I learned it already :)"],
    ["bad_translation", "Bad translation"],
    ["other", "Other"],
  ];

  function handleSubmit(e, reason, customFeedback = null) {
    e.preventDefault();
    
    if (!exerciseBookmarkForFeedback) {
      toast.error("Unable to remove bookmark - bookmark data not available");
      setOpen(false);
      return;
    }
    
    let reasonToSend = reason;
    let reasonForToast;

    if (reason === "other" && customFeedback) {
      reasonToSend = `other: ${customFeedback}`;
      reasonForToast = "Other";
    } else {
      reasonForToast = possibleReasons.find((each) => each[0] === reason)[1];
    }

    toast.success(`"${exerciseBookmarkForFeedback.from}" was removed successfully for: '${reasonForToast}'.`);
    uploadUserFeedback(reasonToSend, exerciseBookmarkForFeedback.id);
    setShowOtherForm(false);
    setOtherFeedback("");
    setOpen(!open);
    if (setHasProvidedQuickFeedback) {
      setHasProvidedQuickFeedback(true);
    }
  }

  return (
    <Modal
      open={open}
      onClose={() => {
        setShowOtherForm(false);
        setOpen(!open);
      }}
    >
      <Header>
        {exerciseBookmarkForFeedback && (
          <Heading>
            Why remove {exerciseBookmarkForFeedback.from}/{exerciseBookmarkForFeedback.to}?
          </Heading>
        )}
      </Header>
      <Main>
        {exerciseBookmarkForFeedback && (
          <>
            {!showOtherForm && (
              <ButtonContainer
                style={{
                  flexWrap: "wrap",
                  justifyContent: "space-around",
                  flexDirection: "row",
                }}
              >
                {possibleReasons.map((each) => (
                  <Button
                    className="small-border-btn white-btn"
                    key={each[0]}
                    onClick={(e) => {
                      if (each[0] === "other") setShowOtherForm(true);
                      else handleSubmit(e, each[0]);
                    }}
                  >
                    {each[1]}
                  </Button>
                ))}
              </ButtonContainer>
            )}
            {showOtherForm && (
              <Form>
                {" "}
                <FormSection>
                  <TextField onChange={(e) => setOtherFeedback(e.target.value)} label={"Other"} />
                  <ButtonContainer className={"adaptive-alignment-horizontal"}>
                    <Button
                      type={"submit"}
                      className="small-border-btn"
                      onClick={(e) => {
                        handleSubmit(e, "other", otherFeedback);
                      }}
                    >
                      Submit
                    </Button>
                    <Button
                      className="small-border-btn white-btn"
                      onClick={(e) => {
                        e.preventDefault();
                        setShowOtherForm(!showOtherForm);
                      }}
                    >
                      Back
                    </Button>
                  </ButtonContainer>
                </FormSection>
              </Form>
            )}
          </>
        )}
      </Main>
    </Modal>
  );
}
