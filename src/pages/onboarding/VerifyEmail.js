import { useState, useContext, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { APIContext } from "../../contexts/APIContext";
import { UserContext } from "../../contexts/UserContext";
import { setTitle } from "../../assorted/setTitle";
import strings from "../../i18n/definitions";

import PreferencesPage from "../_pages_shared/PreferencesPage";
import Header from "../_pages_shared/Header";
import Heading from "../_pages_shared/Heading.sc";
import Main from "../_pages_shared/Main.sc";
import Form from "../_pages_shared/Form.sc";
import FullWidthErrorMsg from "../../components/FullWidthErrorMsg.sc";
import FormSection from "../_pages_shared/FormSection.sc";
import InputField from "../../components/InputField";
import Footer from "../_pages_shared/Footer.sc";
import ButtonContainer from "../_pages_shared/ButtonContainer.sc";
import Button from "../_pages_shared/Button.sc";

export default function VerifyEmail() {
  const api = useContext(APIContext);
  const history = useHistory();
  const { userDetails } = useContext(UserContext);

  const [code, setCode] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isResending, setIsResending] = useState(false);

  useEffect(() => {
    setTitle("Verify Email");
  }, []);

  function handleVerify(e) {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    if (!code.trim()) {
      setErrorMessage("Please enter the verification code");
      return;
    }

    api.confirmEmail(
      code.trim(),
      () => {
        // Success - redirect to select interests
        history.push("/select_interests");
      },
      (error) => {
        setErrorMessage(error || "Invalid or expired code. Please try again.");
      }
    );
  }

  function handleResend() {
    setIsResending(true);
    setErrorMessage("");
    setSuccessMessage("");

    api.resendVerificationCode(
      () => {
        setSuccessMessage("A new verification code has been sent to your email.");
        setIsResending(false);
      },
      (error) => {
        setErrorMessage(error || "Could not resend code. Please try again.");
        setIsResending(false);
      }
    );
  }

  return (
    <PreferencesPage pageWidth={"narrow"}>
      <Header>
        <Heading>Verify Your Email</Heading>
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
            <div style={{
              backgroundColor: "#d4edda",
              color: "#155724",
              padding: "1rem",
              borderRadius: "4px",
              marginBottom: "1rem",
              textAlign: "center"
            }}>
              {successMessage}
            </div>
          )}

          <FormSection>
            <InputField
              type={"text"}
              label={"Verification Code"}
              id={"verification-code"}
              name={"verification-code"}
              placeholder={"Enter 6-character code"}
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
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
    </PreferencesPage>
  );
}
