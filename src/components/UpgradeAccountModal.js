import { useState, useContext } from "react";
import Modal from "./modal_shared/Modal";
import InputField from "./InputField";
import useFormField from "../hooks/useFormField";
import {
  EmailValidator,
  MinimumLengthValidator,
  NonEmptyValidator,
} from "../utils/ValidatorRule/Validator";
import validateRules from "../assorted/validateRules";
import { APIContext } from "../contexts/APIContext";
import { UserContext } from "../contexts/UserContext";
import LocalStorage from "../assorted/LocalStorage";
import { toast } from "react-toastify";
import styled from "styled-components";
import Button from "../pages/_pages_shared/Button.sc";

const ModalContent = styled.div`
  h2 {
    margin-top: 0;
    margin-bottom: 0.5em;
    font-size: 1.5rem;
  }

  .subtitle {
    color: #666;
    margin-bottom: 1.5em;
    font-size: 0.95rem;
  }

  .form-fields {
    display: flex;
    flex-direction: column;
    gap: 1em;
    margin-bottom: 1.5em;
  }

  .buttons {
    display: flex;
    gap: 1em;
    justify-content: center;
  }

  .choice-buttons {
    display: flex;
    flex-direction: column;
    gap: 0.75em;
    margin-bottom: 1em;
  }

  .error-message {
    color: #d32f2f;
    margin-bottom: 1em;
    padding: 0.75em;
    background-color: #ffebee;
    border-radius: 0.25em;
  }

  .success-message {
    color: #2e7d32;
    margin-bottom: 1em;
    padding: 0.75em;
    background-color: #e8f5e9;
    border-radius: 0.25em;
  }

  .code-input {
    font-size: 1.5rem;
    text-align: center;
    letter-spacing: 0.5em;
    padding: 0.5em;
  }

  .back-link {
    margin-top: 1em;
    text-align: center;
    font-size: 0.9rem;
  }

  .back-link a {
    color: hsl(36, 100%, 40%);
    cursor: pointer;
    text-decoration: underline;
  }

  .back-link a:hover {
    color: hsl(36, 100%, 32%);
  }

  .password-field-wrapper {
    position: relative;
  }

  .password-toggle {
    position: absolute;
    right: 0.75rem;
    top: 2.1rem;
    background: none;
    border: none;
    cursor: pointer;
    padding: 0.25rem 0.5rem;
    font-size: 0.85rem;
    color: #666;
  }

  .password-toggle:hover {
    color: #333;
  }
`;

export default function UpgradeAccountModal({
  open,
  onClose,
  onSuccess,
  triggerReason,
  bookmarkCount,
}) {
  const api = useContext(APIContext);
  const { setUserDetails } = useContext(UserContext);
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [step, setStep] = useState("choice"); // "choice", "register", "login", or "confirm"
  const [userEmail, setUserEmail] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [name, setName, validateName, isNameValid, nameMsg] = useFormField("", [
    NonEmptyValidator("Please enter your name"),
  ]);

  const [email, setEmail, validateEmail, isEmailValid, emailMsg] = useFormField(
    "",
    [NonEmptyValidator("Please enter an email"), EmailValidator],
  );

  const [password, setPassword, validatePassword, isPasswordValid, passwordMsg] =
    useFormField("", [
      NonEmptyValidator("Please enter a password"),
      MinimumLengthValidator(4, "Password must be at least 4 characters"),
    ]);

  // Login form fields
  const [loginEmail, setLoginEmail, validateLoginEmail, isLoginEmailValid, loginEmailMsg] =
    useFormField("", [
      NonEmptyValidator("Please enter your email"),
      EmailValidator,
    ]);

  const [loginPassword, setLoginPassword, validateLoginPassword, isLoginPasswordValid, loginPasswordMsg] =
    useFormField("", [NonEmptyValidator("Please enter your password")]);

  const [confirmCode, setConfirmCode] = useState("");

  function handleUpgrade(e) {
    e.preventDefault();
    setErrorMessage("");

    if (!validateRules([validateName, validateEmail, validatePassword])) {
      return;
    }

    setIsSubmitting(true);

    api.upgradeAnonUser(
      email,
      name,
      password,
      () => {
        setIsSubmitting(false);
        setUserEmail(email);
        setStep("confirm");
      },
      (error) => {
        setIsSubmitting(false);
        setErrorMessage(error || "Could not upgrade account. Please try again.");
      },
    );
  }

  function handleConfirm(e) {
    e.preventDefault();
    setErrorMessage("");

    if (!confirmCode || confirmCode.length < 3) {
      setErrorMessage("Please enter the code from your email");
      return;
    }

    setIsSubmitting(true);

    api.confirmEmail(
      confirmCode,
      () => {
        // Clear anonymous credentials
        LocalStorage.clearAnonCredentials();

        // Refresh user details
        api.getUserDetails((user) => {
          setUserDetails(user);
          LocalStorage.setUserInfo(user);
          setIsSubmitting(false);
          toast.success("Account created successfully!");
          if (onSuccess) onSuccess();
          onClose();
        });
      },
      (error) => {
        setIsSubmitting(false);
        setErrorMessage(error || "Invalid code. Please try again.");
      },
    );
  }

  function handleLogin(e) {
    e.preventDefault();
    setErrorMessage("");

    if (!validateRules([validateLoginEmail, validateLoginPassword])) {
      return;
    }

    setIsSubmitting(true);

    api.logIn(
      loginEmail,
      loginPassword,
      (error) => {
        setIsSubmitting(false);
        setErrorMessage(error || "Could not log in. Please check your credentials.");
      },
      (sessionId) => {
        // Clear anonymous credentials
        LocalStorage.clearAnonCredentials();

        // Refresh user details
        api.getUserDetails((user) => {
          setUserDetails(user);
          LocalStorage.setUserInfo(user);
          setIsSubmitting(false);
          if (onSuccess) onSuccess();
          onClose();
        });
      },
    );
  }

  function handleDismiss() {
    LocalStorage.setAnonUpgradeDismissed(true);
    onClose();
  }

  function handleClose() {
    // Reset state when closing
    setStep("choice");
    setConfirmCode("");
    setErrorMessage("");
    onClose();
  }

  const getTitle = () => {
    if (step === "confirm") return "Check your email";
    if (step === "login") return "Log In";
    if (step === "register") return "Create Account";
    // Choice step - show trigger-based titles
    if (triggerReason === "bookmarks") return `You've saved ${bookmarkCount} words!`;
    if (triggerReason === "days") return "Welcome back!";
    if (triggerReason === "settings") return "Save Your Settings";
    if (triggerReason === "exercises") return "Great practice session!";
    return "Save Your Progress";
  };

  const getSubtitle = () => {
    if (step === "confirm")
      return `We sent a confirmation code to ${userEmail}`;
    if (step === "login")
      return "Log in to your existing Zeeguu account.";
    if (step === "register")
      return "Create a new account to save your progress.";
    // Choice step - ask if they have an account
    return "Do you already have a Zeeguu account?";
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <ModalContent>
        <h2>{getTitle()}</h2>
        <p className="subtitle">{getSubtitle()}</p>

        {errorMessage && <div className="error-message">{errorMessage}</div>}

        {step === "choice" && (
          <>
            <div className="choice-buttons">
              <Button
                type="button"
                className="full-width-btn"
                onClick={() => setStep("login")}
              >
                Yes, log me in
              </Button>
              <Button
                type="button"
                className="grey full-width-btn"
                onClick={() => setStep("register")}
              >
                No, create a new account
              </Button>
            </div>
            {triggerReason !== "settings" && (
              <div className="buttons">
                <Button
                  type="button"
                  className="grey"
                  onClick={handleDismiss}
                >
                  Maybe later
                </Button>
              </div>
            )}
          </>
        )}

        {step === "login" && (
          <form onSubmit={handleLogin}>
            <div className="form-fields">
              <InputField
                type="email"
                label="Email"
                id="login-email"
                name="email"
                placeholder="your@email.com"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                isError={!isLoginEmailValid}
                errorMessage={loginEmailMsg}
                autoFocus
              />

              <InputField
                type="password"
                label="Password"
                id="login-password"
                name="password"
                placeholder="Your password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                isError={!isLoginPasswordValid}
                errorMessage={loginPasswordMsg}
              />
            </div>

            <div className="buttons">
              <Button
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Logging in..." : "Log In"}
              </Button>
            </div>

            <div className="back-link">
              <a onClick={() => { setStep("choice"); setErrorMessage(""); }}>
                Back
              </a>
            </div>
          </form>
        )}

        {step === "register" && (
          <form onSubmit={handleUpgrade}>
            <div className="form-fields">
              <InputField
                type="text"
                label="Name"
                id="upgrade-name"
                name="name"
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                isError={!isNameValid}
                errorMessage={nameMsg}
                autoFocus
              />

              <InputField
                type="email"
                label="Email"
                id="upgrade-email"
                name="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                isError={!isEmailValid}
                errorMessage={emailMsg}
              />

              <div className="password-field-wrapper">
                <InputField
                  type={showPassword ? "text" : "password"}
                  label="Password"
                  id="upgrade-password"
                  name="password"
                  placeholder="Choose a password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  isError={!isPasswordValid}
                  errorMessage={passwordMsg}
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            <div className="buttons">
              <Button
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Creating..." : "Create Account"}
              </Button>
            </div>

            <div className="back-link">
              <a onClick={() => { setStep("choice"); setErrorMessage(""); }}>
                Back
              </a>
            </div>
          </form>
        )}

        {step === "confirm" && (
          <form onSubmit={handleConfirm}>
            <div className="form-fields">
              <InputField
                type="text"
                label="Confirmation Code"
                id="confirm-code"
                name="code"
                placeholder="Enter code"
                value={confirmCode}
                onChange={(e) => setConfirmCode(e.target.value)}
                className="code-input"
                autoFocus
              />
            </div>

            <div className="buttons">
              <Button
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Confirming..." : "Confirm"}
              </Button>
            </div>
          </form>
        )}
      </ModalContent>
    </Modal>
  );
}
