import { useState } from "react";
import Modal from "../modal_shared/Modal.js";
import Form from "../../pages/_pages_shared/Form.sc.js";
import ButtonContainer from "../modal_shared/ButtonContainer.sc.js";
import Button from "../../pages/_pages_shared/Button.sc.js";
import FormSection from "../../pages/_pages_shared/FormSection.sc.js";
import Main from "../modal_shared/Main.sc.js";
import Header from "../modal_shared/Header.sc.js";
import Heading from "../modal_shared/Heading.sc.js";
import RadioGroup from "./RadioGroup.js";

//to be replaced with actual languages
const options = [
  { value: "german", label: "German" },
  { value: "danish", label: "Danish" },
  { value: "french", label: "French" },
];

export default function FeedbackModal({ open, setOpen }) {
  const [selectedLanguage, setSelectedLanguage] = useState("german");
  const [reorderedOptions, setReorderedOptions] = useState(options);

  const handleLanguageChange = (event) => {
    setSelectedLanguage(event.target.value);
  };

  function onSubmit(e) {
    e.preventDefault();
    setReorderedOptions([
      ...options.filter((option) => option.value === selectedLanguage),
      ...options.filter((option) => option.value !== selectedLanguage),
    ]);
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
        <Form action={onSubmit}>
          <FormSection>
            <RadioGroup
              legend="Select your active languages:"
              name="active-language"
              options={reorderedOptions}
              selectedValue={selectedLanguage}
              onChange={handleLanguageChange}
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
