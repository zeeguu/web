import { useEffect, useState } from "react";
import { ZeeguuErrorStyle } from "./Modal/Modal.styles";
import { BROWSER_API } from "../utils/browserApi";

export default function ZeeguuError(
  isNotReadable,
  isNotLanguageSupported,
  isMissingSession,
  url
) {
  const [timeout, setTimeout] = useState(5);
  const [reason, setReason] = useState("");

  useEffect(() => {
    document.body.style = "background-color: #ffbb54;";
    const interval = setInterval(() => {
      if (timeout > 0) setTimeout(timeout - 1);
    }, 1000);

    if (isNotLanguageSupported) setReason("We do not support this Language.");
    else if (isNotReadable) setReason("We cannot render this article.");
    else if (isMissingSession === undefined)
      setReason(
        "Something went wrong with your login, please try to relog into Zeeguu."
      );
    else setReason("Something went wrong, please report it to us.");
    return () => clearInterval(interval);
  });

  useEffect(() => {
    if (timeout <= 0) {
      location.reload();
    }
  }, [timeout]);

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
            <h3>Return to Article in {timeout} seconds...</h3>
          </div>
        </div>
      </div>
    </ZeeguuErrorStyle>
  );
}
