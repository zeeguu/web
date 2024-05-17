import { useState } from "react";

import redirect from "../utils/routing/routing";
import { isMobile } from "../utils/misc/browserDetection";
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
          redirect("/select_interests");
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
        <Heading>Create Beta&nbsp;Account</Heading>
      </Header>
      <Main>
        <p>
          To receive an <span className="bold">invite code</span> or to share
          your feedback, reach out to us at{" "}
          <span className="bold">{strings.zeeguuTeamEmail}</span>
        </p>
        <Form action={""} method={"POST"}>
          {errorMessage && (
            <FullWidthErrorMsg>{errorMessage}</FullWidthErrorMsg>
          )}
          <FormSection>
            <InputField
              type={"text"}
              label={strings.inviteCode}
              id={"invite-code"}
              name={"invite-code"}
              placeholder={strings.inviteCodePlaceholder}
              value={inviteCode}
              onChange={handleInviteCodeChange}
            />

            <InputField
              type={"text"}
              label={strings.fullName}
              id={"name"}
              name={"name"}
              placeholder={strings.fullNamePlaceholder}
              value={name}
              onChange={handleNameChange}
            />

            <InputField
              type={"email"}
              label={strings.email}
              id={"email"}
              name={"email"}
              placeholder={strings.emailPlaceholder}
              value={email}
              onChange={handleEmailChange}
            />

            <InputField
              type={"password"}
              label={strings.password}
              id={"password"}
              name={"password"}
              placeholder={strings.passwordPlaceholder}
              value={password}
              onChange={handlePasswordChange}
              helperText={strings.passwordHelperText}
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
                    target={isMobile() ? "_self" : "_blank"}
                  >
                    {strings.privacyNotice}
                  </a>
                </>
              }
            />
          </FormSection>
        </Form>
      </Main>
      <Footer>
        <ButtonContainer className={"padding-medium"}>
          <Button className={"full-width-btn"} onClick={handleCreate}>
            {strings.createAccount}
          </Button>
        </ButtonContainer>
        <p>
          {strings.alreadyHaveAccount + " "}
          <a className="bold underlined-link" href="/login">
            {strings.login}
          </a>
        </p>
      </Footer>
    </InfoPage>
  );
}
