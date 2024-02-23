import { useEffect, useState } from "react";
import { StyledModal } from "./Modal/Modal.styles";

export default function ZeeguuError(
  isReadable,
  isLanguageSupported,
  missSession
) {
  const [timeout, setTimeout] = useState(5);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeout(timeout - 1);
    }, 1000);
    return () => clearInterval(interval);
  });

  useEffect(() => {
    if (timeout <= 0) location.reload();
  }, [timeout]);

  return (
    <StyledModal>
      <img
        className="logo"
        src={chrome.runtime.getURL("images/zeeguuLogo.svg")}
        alt="Zeeguu logo"
      />
      {!isReadable && <h1>We cannot render this article.</h1>}
      {!isLanguageSupported && <h1>We do not support this Language.</h1>}
      {!missSession && (
        <h1>
          Something went wrong with your login, please try to relog into Zeeguu.
        </h1>
      )}
      <h3>Return to Article in {timeout} seconds...</h3>
    </StyledModal>
  );
}
