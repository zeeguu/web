import { useState, useContext } from "react";
import Modal from "./modal_shared/Modal";
import InputField from "./InputField";
import useFormField from "../hooks/useFormField";
import { EmailValidator, MinimumLengthValidator, NonEmptyValidator } from "../utils/ValidatorRule/Validator";
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

export default function UpgradeAccountModal({ open, onClose, onSuccess, triggerReason, bookmarkCount }) {
  const api = useContext(APIContext);
  const { setUserDetails } = useContext(UserContext);
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Restore pending upgrade state if user closed the app mid-flow
  // Since user stays anonymous throughout, this is just for UX convenience
  const [step, setStep] = useState(() => {
    const p = LocalStorage.getAnonUpgradePending();
    return p ? p.step : "email";
  });
  const [userEmail, setUserEmail] = useState(() => {
    const p = LocalStorage.getAnonUpgradePending();
    return p ? p.email : "";
  });
  const [pendingCode, setPendingCode] = useState(() => {
    const p = LocalStorage.getAnonUpgradePending();
    return p ? p.code : null;
  });

  const [email, setEmail, validateEmail, isEmailValid, emailMsg] = useFormField("", [
    NonEmptyValidator("Please enter an email"),
    EmailValidator,
  ]);

  const [password, setPassword, validatePassword, isPasswordValid, passwordMsg] = useFormField("", [
    NonEmptyValidator("Please enter a password"),
    MinimumLengthValidator(4, "Password must be at least 4 characters"),
  ]);

  // Login form fields
  const [loginEmail, setLoginEmail, validateLoginEmail, isLoginEmailValid, loginEmailMsg] = useFormField("", [
    NonEmptyValidator("Please enter your email"),
    EmailValidator,
  ]);

  const [loginPassword, setLoginPassword, validateLoginPassword, isLoginPasswordValid, loginPasswordMsg] = useFormField(
    "",
    [NonEmptyValidator("Please enter your password")],
  );

  const [confirmCode, setConfirmCode] = useState("");

  function finishUpgrade(toastMessage) {
    LocalStorage.clearAnonCredentials();
    LocalStorage.clearAnonUpgradePending();
    api.getUserDetails((user) => {
      setUserDetails(user);
      LocalStorage.setUserInfo(user);
      setIsSubmitting(false);
      toast.success(toastMessage);
      if (onSuccess) onSuccess();
      onClose();
    });
  }

  function handleUpgrade(e) {
    e.preventDefault();
    setErrorMessage("");

    if (!validateRules([validateEmail])) {
      return;
    }

    setIsSubmitting(true);

    // Send verification code without changing the user — they stay anonymous
    api.requestEmailVerification(
      email,
      () => {
        setIsSubmitting(false);
        setUserEmail(email);
        setStep("confirm");
        LocalStorage.setAnonUpgradePending(email, "confirm");
      },
      (error) => {
        setIsSubmitting(false);
        setErrorMessage(error || "Could not send confirmation. Please try again.");
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

    // Just store the code and move to password step — no backend call yet
    setPendingCode(confirmCode);
    setStep("password");
    LocalStorage.setAnonUpgradePending(userEmail, "password", confirmCode);
  }

  function handleSetPassword(e) {
    e.preventDefault();
    setErrorMessage("");

    if (!validateRules([validatePassword])) {
      return;
    }

    setIsSubmitting(true);

    // Complete the upgrade atomically: verify code + set email + set password + mark verified
    const codeToUse = pendingCode || confirmCode;

    api.completeAccountUpgrade(
      userEmail,
      codeToUse,
      password,
      () => {
        finishUpgrade("Account set up!");
      },
      (error) => {
        setIsSubmitting(false);
        // If code is expired or invalid, go back to email step so they can get a new code
        if (error && (error.includes("expired") || error.includes("No verification"))) {
          setStep("email");
          setConfirmCode("");
          setPendingCode(null);
          LocalStorage.clearAnonUpgradePending();
        }
        setErrorMessage(error || "Could not complete account setup. Please try again.");
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
        finishUpgrade("Welcome back!");
      },
    );
  }

  function handleClose() {
    setStep("email");
    setConfirmCode("");
    setErrorMessage("");
    LocalStorage.clearAnonUpgradePending();
    onClose();
  }

  const getTitle = () => {
    if (step === "confirm") return "Check your email";
    if (step === "password") return "Choose a password";
    if (step === "login") return "Log In";
    // Email step - show trigger-based titles
    if (triggerReason === "bookmarks") return `You've saved ${bookmarkCount} words!`;
    if (triggerReason === "days") return "Welcome back!";
    if (triggerReason === "settings") return "Save Your Settings";
    if (triggerReason === "exercises") return "Great practice session!";
    return "Save Your Progress";
  };

  const getSubtitle = () => {
    if (step === "confirm") return `We sent a confirmation code to ${userEmail}`;
    if (step === "password") return "Set a password so you can log in on other devices.";
    if (step === "login") return "Log in to your existing Zeeguu account.";
    return "Please confirm your email to continue.";
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <ModalContent>
        <h2>{getTitle()}</h2>
        <p className="subtitle">{getSubtitle()}</p>

        {errorMessage && <div className="error-message">{errorMessage}</div>}

        {step === "email" && (
          <form onSubmit={handleUpgrade}>
            <div className="form-fields">
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
                autoFocus
              />
            </div>

            <div className="buttons">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Sending code..." : "Send confirmation code"}
              </Button>
            </div>

            <div className="back-link">
              <a
                onClick={() => {
                  setStep("login");
                  setErrorMessage("");
                }}
              >
                I already have an account
              </a>
            </div>
          </form>
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
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Logging in..." : "Log In"}
              </Button>
            </div>

            <div className="back-link">
              <a
                onClick={() => {
                  setStep("email");
                  setErrorMessage("");
                }}
              >
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
                inputMode="numeric"
                pattern="[0-9]*"
                label="Confirmation Code"
                id="confirm-code"
                name="code"
                placeholder="1234"
                value={confirmCode}
                onChange={(e) => setConfirmCode(e.target.value)}
                className="code-input"
                autoFocus
              />
            </div>

            <div className="buttons">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Confirming..." : "Confirm"}
              </Button>
            </div>

            <div className="back-link">
              <a
                onClick={() => {
                  setErrorMessage("");
                  api.requestEmailVerification(
                    userEmail,
                    () => {
                      toast.success("Code resent!");
                    },
                    (err) => {
                      setErrorMessage(err || "Could not resend code.");
                    },
                  );
                }}
              >
                Resend code
              </a>
              {" | "}
              <a
                onClick={() => {
                  setStep("email");
                  setConfirmCode("");
                  setErrorMessage("");
                  LocalStorage.clearAnonUpgradePending();
                }}
              >
                Change email
              </a>
            </div>
          </form>
        )}

        {step === "password" && (
          <form onSubmit={handleSetPassword}>
            <div className="form-fields">
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
                  autoFocus
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
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : "Save password"}
              </Button>
            </div>

            <div className="back-link">
              <a
                onClick={() => {
                  setErrorMessage("");
                  api.requestEmailVerification(
                    userEmail,
                    () => {
                      toast.success("Code resent!");
                    },
                    (err) => {
                      setErrorMessage(err || "Could not resend code.");
                    },
                  );
                }}
              >
                Resend code
              </a>
              {" | "}
              <a
                onClick={() => {
                  setStep("email");
                  setConfirmCode("");
                  setErrorMessage("");
                  LocalStorage.clearAnonUpgradePending();
                }}
              >
                Change email
              </a>
            </div>
          </form>
        )}

        {step === "password" && (
          <form onSubmit={handleSetPassword}>
            <div className="form-fields">
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
                  autoFocus
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
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : "Save password"}
              </Button>
            </div>
          </form>
        )}
      </ModalContent>
    </Modal>
  );
}
