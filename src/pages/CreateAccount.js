import { useState } from "react";

import redirect from "../utils/routing/routing";
import useFormField from "../hooks/useFormField";

import InfoPage from "./info_page_shared/InfoPage";
import Header from "./info_page_shared/Header";
import Heading from "./info_page_shared/Heading";
import Main from "./info_page_shared/Main";
import Form from "./info_page_shared/Form";
import FullWidthErrorMsg from "./info_page_shared/FullWidthErrorMsg";
import FormSection from "./info_page_shared/FormSection";
import InputField from "./info_page_shared/InputField";
import Footer from "./info_page_shared/Footer";
import ButtonContainer from "./info_page_shared/ButtonContainer";
import Button from "./info_page_shared/Button";
import Checkbox from "../components/modal_shared/Checkbox";

import validator from "../assorted/validator";
import strings from "../i18n/definitions";

import * as EmailValidator from "email-validator";

export default function CreateAccount({ api, handleSuccessfulSignIn }) {
  const [inviteCode, handleInviteCodeChange] = useFormField("");
  const [name, handleNameChange] = useFormField("");
  const [email, handleEmailChange] = useFormField("");
  const [password, handlePasswordChange] = useFormField("");

  const [errorMessage, setErrorMessage] = useState("");

  let validatorRules = [
    [name === "", strings.nameIsRequired],
    [!EmailValidator.validate(email), strings.plsProvideValidEmail],
    [password.length < 4, strings.passwordMustBeMsg],
  ];

  function handleCreate(e) {
    e.preventDefault();

    if (!validator(validatorRules, setErrorMessage)) {
      return;
    }

    let userInfo = {
      name: name,
      email: email,
    };

    api.addBasicUser(
      inviteCode,
      password,
      userInfo,
      (session) => {
        api.getUserDetails((user) => {
          handleSuccessfulSignIn(user);
          redirect("/language_preferences");
        });
      },
      (error) => {
        setErrorMessage(error);
      },
    );
  }

  return (
    <InfoPage type={"narrow"}>
      <Header>
        <Heading>Create Beta Account</Heading>
      </Header>
      <Main>
        <p>
          To receive an <span className="bold">invitation code</span> or to
          share your feedback, reach out to us at{" "}
          <span className="bold">zeeguu.team@gmail.com</span>
        </p>
        <Form action={""} method={"POST"}>
          {errorMessage && (
            <FullWidthErrorMsg>{errorMessage}</FullWidthErrorMsg>
          )}
          <FormSection>
            <InputField
              type={"text"}
              label={"Invite code"}
              id={"invite-code"}
              name={"invite-code"}
              placeholder={strings.code}
              value={inviteCode}
              onChange={handleInviteCodeChange}
            />

            <InputField
              type={"text"}
              label={"Full name"}
              id={"name"}
              name={"name"}
              placeholder={"First and last name"}
              value={name}
              onChange={handleNameChange}
            />

            <InputField
              type={"email"}
              label={"Email"}
              id={"email"}
              name={"email"}
              placeholder={"example@email.com"}
              value={email}
              onChange={handleEmailChange}
            />

            <InputField
              type={"password"}
              label={"Password"}
              id={"password"}
              name={"password"}
              placeholder={"Insert your password"}
              value={password}
              onChange={handlePasswordChange}
              helperText={"Must contain at least 4 characters"}
            />
          </FormSection>
          <FormSection>
            <Checkbox
              label={
                <>
                  By checking this box you agree to our{" "}
                  <a
                    className="bold underlined-link"
                    href="https://raw.githubusercontent.com/zeeguu/browser-extension/main/PRIVACY.md"
                  >
                    Privacy Notice
                  </a>
                </>
              }
            />
          </FormSection>
          <ButtonContainer>
            <Button onClick={handleCreate}>{strings.createAccount}</Button>
          </ButtonContainer>
        </Form>
      </Main>
      <Footer>
        <p>
          Already have an account?{" "}
          <a className="bold underlined-link" href="/login">
            Log in
          </a>
        </p>
      </Footer>
    </InfoPage>
  );
}
