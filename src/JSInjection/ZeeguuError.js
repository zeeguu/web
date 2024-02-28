import { useEffect, useState } from "react";
import { ZeeguuErrorStyle } from "./Modal/Modal.styles";
import { BROWSER_API } from "../utils/browserApi";
import { StyledPrimaryButton } from "./Modal/Buttons.styles";
import ReportError from "../reportError/ReportError";
import {
  SESSISON_FEEDBACK,
  LANGUAGE_FEEDBACK,
  READABILITY_FEEDBACK,
  OTHER_FEEDBACK,
} from "./constants";

export default function ZeeguuError({
  isNotReadable,
  isNotLanguageSupported,
  isMissingSession,
  api,
}) {
  const [timeout, setTimeout] = useState(7);
  const [reason, setReason] = useState("");
  const [feedbackSuccess, setFeedbackSuccess] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      if (timeout > 0) setTimeout(timeout - 1);
    }, 1000);

    if (isMissingSession === undefined) setReason(SESSISON_FEEDBACK);
    else if (isNotLanguageSupported) setReason(LANGUAGE_FEEDBACK);
    else if (isNotReadable) setReason(READABILITY_FEEDBACK);
    else setReason(OTHER_FEEDBACK);
    return () => clearInterval(interval);
  });

  useEffect(() => {
    if (timeout <= 0) {
      window.location.reload();
    }
  }, [timeout]);

  function toArticle() {
    window.location.reload();
  }

  function toZeeguu() {
    window.location.href = "https://www.zeeguu.org/";
  }
  return (
    <ZeeguuErrorStyle>
      <div className="background">
        <div className="card">
          <div className="content">
            <img
              className="logo"
              src={BROWSER_API.runtime.getURL("images/zeeguuLogo.svg")}
              alt="Zeeguu logo"
            />
            <h1>{reason}</h1>
            <ReportError
              api={api}
              feedback={reason}
              feedbackSuccess={feedbackSuccess}
              setFeedbackSuccess={setFeedbackSuccess}
            />
            <h3>Return to Article in {timeout} seconds...</h3>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <StyledPrimaryButton
              onClick={toArticle}
              name="toArticle"
              style={{ maxWidth: "12em", padding: "1em" }}
            >
              ⬅ Back to Article
            </StyledPrimaryButton>
            <StyledPrimaryButton
              onClick={toZeeguu}
              name="toZeeguu"
              style={{ maxWidth: "10em", padding: "1em" }}
            >
              Go to Zeeguu
            </StyledPrimaryButton>
          </div>
        </div>
      </div>
    </ZeeguuErrorStyle>
  );
}
