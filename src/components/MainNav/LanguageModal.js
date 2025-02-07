import { useState, useEffect, useContext } from "react";
import { APIContext } from "../../contexts/APIContext.js";
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
  const [isLoading, setIsLoading] = useState(false);
  const [activeLanguages, setActiveLanguages] = useState(undefined);
  const [selectedLanguage, setSelectedLanguage] = useState("de");
  const api = useContext(APIContext);

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
  }, [open, api]);

  const handleLanguageChange = (event) => {
    setSelectedLanguage(event.target.value);
  };

  function onSubmit(e) {
    e.preventDefault();
    console.log("Selected a new language");
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
          <Heading>Your Active Languages:</Heading>
        </Header>
        <Form onSubmit={onSubmit}>
          <FormSection>
            <RadioGroup
              legend="Select your active language:"
              name="active-language"
              options={activeLanguages}
              selectedValue={selectedLanguage}
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
              Submit
            </Button>
          </ButtonContainer>
        </Form>
      </Main>
    </Modal>
  );
}
