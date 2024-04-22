import { useState } from "react";

import redirect from "../utils/routing/routing";

import InfoPage from "./info_page_shared/InfoPage";
import Header from "./info_page_shared/Header";
import Heading from "./info_page_shared/Heading";
import Main from "./info_page_shared/Main";
import Form from "./info_page_shared/Form";
import FormSection from "./info_page_shared/FormSection";
import InputField from "./info_page_shared/InputField";
import Footer from "./info_page_shared/Footer";
import ButtonContainer from "./info_page_shared/ButtonContainer";
import Button from "./info_page_shared/Button";

import validator from "../assorted/validator";
import strings from "../i18n/definitions";

import PrivacyNotice from "./PrivacyNotice";
import * as EmailValidator from "email-validator";

export default function CreateAccount({ api, handleSuccessfulSignIn }) {
  const [inviteCode, setInviteCode] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

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
          {strings.thankYouMsgPrefix}
          <a
            href="mailto:zeeguu.team@gmail.com?subject=Invitation Code Request&body=Dear Zeeguu Team,
              %0D%0A%0D%0AI would like to request the Invitation Code to register for Zeeguu.%0D%0A%0D%0AThank you!"
          >
            <b> zeeguu.team@gmail.com</b>
          </a>
          {strings.thankYouMsgSuffix}
        </p>

        <Form action={""} method={"POST"}>
          <FormSection>
            <InputField
              type={"text"}
              label={"Invite code"}
              id={"invite-code"}
              name={"invite-code"}
              placeholder={strings.code}
              value={inviteCode}
              onChange={(e) => setInviteCode(e.target.value)}
              helperLink={"Request invite code"}
              helperLinkHref={`mailto:zeeguu.team@gmail.com?subject=Invitation Code Request&body=Dear Zeeguu Team,
              %0D%0A%0D%0AI would like to request the Invitation Code to register for Zeeguu.%0D%0A%0D%0AThank you!`}
            />

            <InputField
              type={"text"}
              label={"Full name"}
              id={"name"}
              name={"name"}
              placeholder={"First and last name"}
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <InputField
              type={"email"}
              label={"Email"}
              id={"email"}
              name={"email"}
              placeholder={"example@email.com"}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <InputField
              type={"password"}
              label={"Password"}
              id={"password"}
              name={"password"}
              placeholder={"Insert your password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              helperText={"Must contain at least 4 characters"}
            />
          </FormSection>

          {/* <PrivacyNotice /> */}

          {errorMessage && <div className="error">{errorMessage}</div>}
          <span>
            <span>By checking this box you agree to</span>{" "}
            <a>Zeeguu's Privacy notice</a>
          </span>
          <ButtonContainer>
            <Button onClick={handleCreate}>{strings.createAccount}</Button>
          </ButtonContainer>
        </Form>
      </Main>
      <Footer>
        <p>
          Already have an account?{" "}
          <a className="links" href="/login">
            <b>Log in</b>
          </a>
        </p>
      </Footer>
    </InfoPage>
  );
}
