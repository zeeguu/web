import { useState, useContext, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { APIContext } from "../../contexts/APIContext";
import useFunnelStep from "../../hooks/useFunnelStep";
import { funnelError } from "../../api/onboardingFunnel";
import { UserContext } from "../../contexts/UserContext";
import { setTitle } from "../../assorted/setTitle";
import strings from "../../i18n/definitions";

import CardPage from "../_pages_shared/CardPage";
import Header from "../_pages_shared/Header";
import PageTitle from "../_pages_shared/PageTitle.sc";
import Main from "../_pages_shared/Main.sc";
import Form from "../_pages_shared/Form.sc";
import FullWidthErrorMsg from "../../components/FullWidthErrorMsg.sc";
import FormSection from "../_pages_shared/FormSection.sc";
import InputField from "../../components/InputField";
import Footer from "../_pages_shared/Footer.sc";
import ButtonContainer from "../_pages_shared/ButtonContainer.sc";
import Button from "../_pages_shared/Button.sc";
import LocalStorage from "../../assorted/LocalStorage";
import { saveSharedUserInfo } from "../../utils/cookies/userInfo";

export default function VerifyEmail() {
  const api = useContext(APIContext);
  const history = useHistory();
  const { userDetails, setUserDetails } = useContext(UserContext);

  const [code, setCode] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  useFunnelStep("verify_email");
  const [isResending, setIsResending] = useState(false);

  useEffect(() => {
    setTitle("Verify Email");
  }, []);

  function handleVerify(e) {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    if (!code.trim()) {
      api.funnelEvent("verify_code_empty");
      setErrorMessage("Please enter the verification code");
      return;
    }

    api.confirmEmail(
      code.trim(),
      async () => {
        api.funnelEvent("email_verified");
        // Success - redirect to select interests
        const user = await api.getUserDetails();
        setUserDetails(user);
        LocalStorage.setUserInfo(user);
        saveSharedUserInfo(user);
        history.push("/select_interests");
      },
      (error) => {
        api.funnelEvent("verify_code_rejected", { error: funnelError(error) });
        setErrorMessage(error || "Invalid or expired code. Please try again.");
      },
    );
  }

  function handleResend() {
    api.funnelEvent("verify_code_resent");
    setIsResending(true);
    setErrorMessage("");
    setSuccessMessage("");

    api.resendVerificationCode(
      () => {
        setSuccessMessage("A new verification code has been sent to your email.");
        setIsResending(false);
      },
      (error) => {
        api.funnelEvent("verify_code_resend_failed", { error: funnelError(error) });
        setErrorMessage(error || "Could not resend code. Please try again.");
        setIsResending(false);
      },
    );
  }

  return (
    <CardPage pageWidth={"narrow"} isBackgroundFixed={true}>
      <Header>
        <PageTitle>Verify Your Email</PageTitle>
      </Header>
      <Main>
        <p style={{ textAlign: "center", marginBottom: "1.5rem" }}>
          We've sent a verification code to <strong>{userDetails?.email || "your email"}</strong>.
          <br />
          Please enter it below to continue.
        </p>

        <Form action={""} method={"POST"}>
          {errorMessage && <FullWidthErrorMsg>{errorMessage}</FullWidthErrorMsg>}
          {successMessage && (
            <div
              style={{
                backgroundColor: "#d4edda",
                color: "#155724",
                padding: "1rem",
                borderRadius: "4px",
                marginBottom: "1rem",
                textAlign: "center",
              }}
            >
              {successMessage}
            </div>
          )}

          <FormSection>
            <InputField
              type={"text"}
              label={"Verification Code"}
              id={"verification-code"}
              name={"verification-code"}
              placeholder={"Enter 4-digit code"}
              inputMode={"numeric"}
              autoComplete={"one-time-code"}
              value={code}
              onChange={(e) => setCode(e.target.value)}
              style={{ textAlign: "center", fontSize: "1.5rem", letterSpacing: "0.5rem" }}
            />
          </FormSection>

          <ButtonContainer className={"padding-medium"}>
            <Button type={"submit"} className={"full-width-btn"} onClick={handleVerify}>
              Verify Email
            </Button>
          </ButtonContainer>
        </Form>
      </Main>
      <Footer>
        <p className="centered">
          Didn't receive the code?{" "}
          <span
            className="bold underlined-link"
            onClick={handleResend}
            style={{ cursor: isResending ? "wait" : "pointer" }}
          >
            {isResending ? "Sending..." : "Resend Code"}
          </span>
        </p>
        <p className="centered" style={{ marginTop: "0.5rem", fontSize: "0.9rem", color: "#666" }}>
          Check your spam folder if you don't see the email.
        </p>
      </Footer>
    </CardPage>
  );
}
