import { useContext, useEffect, useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { APIContext } from "../../../contexts/APIContext";
import { UserContext } from "../../../contexts/UserContext";
import { setTitle } from "../../../assorted/setTitle";
import LocalStorage from "../../../assorted/LocalStorage";
import { saveSharedUserInfo } from "../../../utils/cookies/userInfo";
import strings from "../../../i18n/definitions";
import CardPage from "../../_pages_shared/CardPage";
import Main from "../../_pages_shared/Main.sc";
import Form from "../../_pages_shared/Form.sc";
import FormSection from "../../_pages_shared/FormSection.sc";
import ButtonContainer from "../../_pages_shared/ButtonContainer.sc";
import Button from "../../_pages_shared/Button.sc";
import InputField from "../../../components/InputField";
import FullWidthErrorMsg from "../../../components/FullWidthErrorMsg.sc";
import FullWidthConfirmMsg from "../../../components/FullWidthConfirmMsg.sc";
import SettingsPageHeader from "../SharedComponents/SettingsPageHeader";

// Two steps: the new address + current password send a code to the new
// address; the code (and the same password, which the API checks again)
// makes the switch. Nothing changes on the account until the second step.
export default function ChangeEmail() {
  const api = useContext(APIContext);
  const history = useHistory();
  const { userDetails, setUserDetails } = useContext(UserContext);
  const from = useLocation().state?.from;

  const [newEmail, setNewEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [codeSent, setCodeSent] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [infoMessage, setInfoMessage] = useState("");
  const [isBusy, setIsBusy] = useState(false);

  useEffect(() => {
    setTitle("Change email");
  }, []);

  function fail(error) {
    setIsBusy(false);
    setErrorMessage(error || "Something went wrong. Please try again.");
  }

  function sendCode(e) {
    e?.preventDefault();
    setErrorMessage("");
    setInfoMessage("");
    if (!newEmail.trim() || !password) {
      setErrorMessage("Please enter the new email and your password.");
      return;
    }
    setIsBusy(true);
    api.requestEmailChange(
      newEmail.trim(),
      password,
      () => {
        setIsBusy(false);
        setCodeSent(true);
        setInfoMessage(`We sent a code to ${newEmail.trim()}. Check the spam folder if it doesn't arrive.`);
      },
      fail,
    );
  }

  function confirm(e) {
    e.preventDefault();
    setErrorMessage("");
    if (!code.trim()) {
      setErrorMessage("Please enter the code from the email.");
      return;
    }
    setIsBusy(true);
    api.confirmEmailChange(
      newEmail.trim(),
      password,
      code.trim(),
      async () => {
        const user = await api.getUserDetails();
        setUserDetails(user);
        LocalStorage.setUserInfo(user);
        saveSharedUserInfo(user);
        history.push("/account_settings/profile_details", { emailChanged: true, from });
      },
      fail,
    );
  }

  const step = codeSent ? (
    <CodeStep code={code} setCode={setCode} isBusy={isBusy} onConfirm={confirm} onResend={sendCode} />
  ) : (
    <NewAddressStep
      currentEmail={userDetails?.email}
      newEmail={newEmail}
      setNewEmail={setNewEmail}
      password={password}
      setPassword={setPassword}
      isBusy={isBusy}
      onSend={sendCode}
    />
  );

  return (
    <CardPage layoutVariant={"card-under-menu"} isTransparent reducedPadding>
      <SettingsPageHeader title={"Change email"} redirectLink={"/account_settings/profile_details"} />
      <Main>
        <Form>
          {errorMessage && <FullWidthErrorMsg>{errorMessage}</FullWidthErrorMsg>}
          {infoMessage && <FullWidthConfirmMsg>{infoMessage}</FullWidthConfirmMsg>}
          {step}
        </Form>
      </Main>
    </CardPage>
  );
}

function NewAddressStep({ currentEmail, newEmail, setNewEmail, password, setPassword, isBusy, onSend }) {
  return (
    <>
      <FormSection>
        <InputField type={"email"} label={"Current email"} id={"current-email"} value={currentEmail || ""} readOnly />
        <InputField
          type={"email"}
          label={"New email"}
          id={"new-email"}
          name={"new-email"}
          placeholder={strings.emailPlaceholder}
          value={newEmail}
          onChange={(e) => setNewEmail(e.target.value)}
          autoComplete={"email"}
          autoFocus
        />
        <InputField
          type={"password"}
          label={"Your password"}
          id={"password"}
          name={"password"}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete={"current-password"}
          helperText={"To make sure it's you."}
        />
      </FormSection>
      <ButtonContainer className={"adaptive-alignment-horizontal"}>
        <Button type={"submit"} onClick={onSend} disabled={isBusy}>
          {isBusy ? "Sending..." : "Send code"}
        </Button>
      </ButtonContainer>
    </>
  );
}

function CodeStep({ code, setCode, isBusy, onConfirm, onResend }) {
  return (
    <>
      <FormSection>
        <InputField
          type={"text"}
          label={"Code from the email"}
          id={"email-change-code"}
          name={"email-change-code"}
          inputMode={"numeric"}
          autoComplete={"one-time-code"}
          value={code}
          onChange={(e) => setCode(e.target.value)}
          autoFocus
        />
      </FormSection>
      <ButtonContainer className={"adaptive-alignment-horizontal"}>
        <Button type={"submit"} onClick={onConfirm} disabled={isBusy}>
          {isBusy ? "Changing..." : "Change email"}
        </Button>
        <Button type={"button"} className={"grey"} onClick={onResend} disabled={isBusy}>
          Send a new code
        </Button>
      </ButtonContainer>
    </>
  );
}
