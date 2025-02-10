import { useState, useEffect, useContext } from "react";
import { APIContext } from "../../contexts/APIContext.js";
import { UserContext } from "../../contexts/UserContext.js";
import Modal from "../modal_shared/Modal.js";
import Form from "../../pages/_pages_shared/Form.sc.js";
import ButtonContainer from "../modal_shared/ButtonContainer.sc.js";
import Button from "../../pages/_pages_shared/Button.sc.js";
import FormSection from "../../pages/_pages_shared/FormSection.sc.js";
import Main from "../modal_shared/Main.sc.js";
import Header from "../modal_shared/Header.sc.js";
import Heading from "../modal_shared/Heading.sc.js";
import RadioGroup from "./RadioGroup.js";

export default function FeedbackModal({ open, setOpen }) {
  const api = useContext(APIContext);
  const user = useContext(UserContext);
  const [isLoading, setIsLoading] = useState(false);
  const [currentLearnedLanguage, setCurrentLearnedLanguage] =
    useState(undefined);
  const [activeLanguages, setActiveLanguages] = useState(undefined);

  useEffect(() => {
    let isMounted = true;

    if (open) {
      setIsLoading(true);
      api.getUserLanguages((data) => {
        if (isMounted) {
          console.log("Languages:", data);
          setActiveLanguages(data);
          setIsLoading(false);
        }
      });

      return () => {
        isMounted = false;
        setActiveLanguages(undefined);
        setIsLoading(false);
      };
    }
  }, [open, api, user.session]);

  useEffect(() => {
    setCurrentLearnedLanguage(user.learned_language);
  }, [user.learned_language, open]);

  const handleLanguageChange = (event) => {
    setCurrentLearnedLanguage(event.target.value);
  };

  function onSubmit(e) {
    e.preventDefault();
    setOpen(false);
  }

  return (
    <Modal
      open={open}
      onClose={() => {
        setOpen(false);
      }}
    >
      <Header withoutLogo>
        <Heading>Your Active Languages:</Heading>
      </Header>
      <Main>
        <Form onSubmit={onSubmit}>
          <FormSection>
            <RadioGroup
              legend="Select your active language:"
              name="active-language"
              options={activeLanguages}
              selectedValue={currentLearnedLanguage}
              onChange={handleLanguageChange}
              optionLabel={(e) => e.language}
              optionValue={(e) => e.code}
              optionId={(e) => e.id}
            />
          </FormSection>
          <ButtonContainer className={"adaptive-alignment-horizontal"}>
            <Button
              type={"submit"}
              onClick={(e) => {
                onSubmit(e);
              }}
            >
              Save
            </Button>
          </ButtonContainer>
        </Form>
      </Main>
    </Modal>
  );
}
