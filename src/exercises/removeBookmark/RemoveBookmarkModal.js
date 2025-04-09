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
import MatchBookmarkSelection from "./MatchBookmarkSelection";

export default function RemoveBookmarkModal({
  isTestingMultipleBookmarks,
  exerciseBookmarks,
  open,
  setOpen,
  uploadUserFeedback,
  setHasProvidedQuickFeedback,
}) {
  const [showOtherForm, setShowOtherForm] = useState(false);
  const [otherFeedback, setOtherFeedback] = useState("");
  const [hasMultipleBookmarks, setHasMultipleBookmarks] = useState(false);
  const [exerciseBookmarkIdForFeedback, setExerciseBookmarkIdForFeedback] =
    useState(null);

  useEffect(() => {
    if (exerciseBookmarks) {
      if (exerciseBookmarks.length > 1 && isTestingMultipleBookmarks) {
        setHasMultipleBookmarks(true);
        setExerciseBookmarkIdForFeedback(null);
      } else {
        setHasMultipleBookmarks(false);
        setExerciseBookmarkIdForFeedback(exerciseBookmarks[0].id);
      }
    }
  }, [exerciseBookmarks, isTestingMultipleBookmarks]);

  const possibleReasons = [
    ["too_easy", "Too Easy"],
    ["too_hard", "Too Hard"],
    ["bad_context", "Bad Context"],
    ["dont_want_to_see_this_word", "Don't want to see this word"],
    ["other", "Other"],
  ];

  function handleSubmit(e, reason) {
    e.preventDefault();
    let bookmarkToProvideFeedback = exerciseBookmarks.filter(
      (b) => b.id === exerciseBookmarkIdForFeedback,
    )[0];
    toast.success(
      `Bookmark ${bookmarkToProvideFeedback.from} removed successfully ${reason}`,
    );
    uploadUserFeedback(reason, bookmarkToProvideFeedback.id);
    setOpen(!open);
    setHasProvidedQuickFeedback(true);
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
        <Heading>Removing a word/expression from exercises</Heading>
      </Header>
      <Main>
        {hasMultipleBookmarks && (
          <MatchBookmarkSelection
            bookmarkSelected={exerciseBookmarkIdForFeedback}
            exerciseBookmarks={exerciseBookmarks}
            setExerciseBookmarkForFeedback={setExerciseBookmarkIdForFeedback}
          ></MatchBookmarkSelection>
        )}
        {(!hasMultipleBookmarks ||
          (hasMultipleBookmarks && exerciseBookmarkIdForFeedback !== null)) && (
          <>
            {exerciseBookmarkIdForFeedback && (
              <p>
                Why don't you want to see '
                <b>{exerciseBookmarkIdForFeedback.from}</b>'?
              </p>
            )}

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
                  <TextField
                    onChange={(e) => setOtherFeedback(e.target.value)}
                    label={"Other"}
                  />
                  <ButtonContainer className={"adaptive-alignment-horizontal"}>
                    <Button
                      type={"submit"}
                      className="small-border-btn"
                      onClick={(e) => {
                        handleSubmit(e, otherFeedback);
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
