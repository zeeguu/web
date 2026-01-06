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
import styled from "styled-components";

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
    justify-content: flex-end;
  }

  .btn {
    padding: 0.75em 1.5em;
    border-radius: 0.5em;
    border: none;
    cursor: pointer;
    font-size: 1rem;
    font-weight: 500;
  }

  .btn-primary {
    background-color: #0077cc;
    color: white;
  }

  .btn-primary:hover {
    background-color: #005fa3;
  }

  .btn-secondary {
    background-color: #f0f0f0;
    color: #333;
  }

  .btn-secondary:hover {
    background-color: #e0e0e0;
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
  const [step, setStep] = useState("register"); // "register" or "confirm"
  const [userEmail, setUserEmail] = useState("");

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

  function handleDismiss() {
    LocalStorage.setAnonUpgradeDismissed(true);
    onClose();
  }

  function handleClose() {
    // Reset state when closing
    setStep("register");
    setConfirmCode("");
    setErrorMessage("");
    onClose();
  }

  const getTitle = () => {
    if (step === "confirm") return "Check your email";
    if (triggerReason === "bookmarks") return `You've saved ${bookmarkCount} words!`;
    if (triggerReason === "days") return "Welcome back!";
    if (triggerReason === "settings") return "Save Your Settings";
    if (triggerReason === "exercises") return "Great practice session!";
    return "Create Your Account";
  };

  const getSubtitle = () => {
    if (step === "confirm")
      return `We sent a confirmation code to ${userEmail}`;
    if (triggerReason === "bookmarks")
      return "Create an account to keep your vocabulary safe and sync across devices.";
    if (triggerReason === "days")
      return "You've been learning for a few days now. Create an account to keep your progress.";
    if (triggerReason === "settings")
      return "Create an account to save your preferences and keep your progress across devices.";
    if (triggerReason === "exercises")
      return "Create an account to save your progress and keep practicing.";
    return "Save your progress and access your vocabulary from any device.";
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <ModalContent>
        <h2>{getTitle()}</h2>
        <p className="subtitle">{getSubtitle()}</p>

        {errorMessage && <div className="error-message">{errorMessage}</div>}

        {step === "register" ? (
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

              <InputField
                type="password"
                label="Password"
                id="upgrade-password"
                name="password"
                placeholder="Choose a password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                isError={!isPasswordValid}
                errorMessage={passwordMsg}
              />
            </div>

            <div className="buttons">
              {triggerReason !== "settings" && (
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={handleDismiss}
                  disabled={isSubmitting}
                >
                  Maybe later
                </button>
              )}
              <button
                type="submit"
                className="btn btn-primary"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Creating..." : "Create Account"}
              </button>
            </div>
          </form>
        ) : (
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
              <button
                type="submit"
                className="btn btn-primary"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Confirming..." : "Confirm"}
              </button>
            </div>
          </form>
        )}
      </ModalContent>
    </Modal>
  );
}
