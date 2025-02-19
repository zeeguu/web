import Modal from "../../components/modal_shared/Modal";
import Header from "../../components/modal_shared/Header.sc";
import Main from "../../components/modal_shared/Main.sc";
import Heading from "../../components/modal_shared/Heading.sc";
import ButtonContainer from "../../components/modal_shared/ButtonContainer.sc";
import Button from "../../pages/_pages_shared/Button.sc";
import TextField from "../../components/TextField";
import FormSection from "../../pages/_pages_shared/FormSection.sc";
import Form from "../../pages/_pages_shared/Form.sc";
import { useState } from "react";
import MatchBookmarkSelection from "./MatchBookmarkSelection";

export default function RemoveBookmarkModal({ matchBookmarks, open, setOpen }) {
  const [showOtherForm, setShowOtherForm] = useState(false);
  const [matchSelectedBookmark, setMatchSelectedBookmark] = useState(null);
  const possibleReasons = [
    ["too_easy", "Too Easy"],
    ["too_hard", "Too Hard"],
    ["bad_context", "Bad Context"],
    ["dont_want_to_see_this_word", "Don't want to see this word"],
    ["other", "Other"],
  ];
  return (
    <Modal
      open={open}
      onClose={() => {
        setShowOtherForm(false);
        setOpen(!open);
      }}
    >
      <Header>
        <Heading>Removing bookmark from exercises</Heading>
      </Header>
      <Main>
        {matchBookmarks && (
          <MatchBookmarkSelection
            bookmarkSelected={matchSelectedBookmark}
            matchBookmarks={matchBookmarks}
            setMatchBookmarkForFeedback={setMatchSelectedBookmark}
          ></MatchBookmarkSelection>
        )}
        {((!matchBookmarks && matchSelectedBookmark === null) ||
          (matchBookmarks && matchSelectedBookmark !== null)) && (
          <>
            <p>Why don't you want to see this bookmark?</p>
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
                  <TextField label={"Other"} />
                  <ButtonContainer className={"adaptive-alignment-horizontal"}>
                    <Button
                      type={"submit"}
                      className="small-border-btn"
                      onClick={(e) => {}}
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
