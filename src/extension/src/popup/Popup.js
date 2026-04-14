/*global chrome*/
import { useEffect, useState } from "react";

import logo from "../../../../public/static/images/zeeguu128.png";
import Zeeguu_API from "../../../api/Zeeguu_API";
import { API_URL, WEB_URL } from "../../../config";
import { EXTENSION_SOURCE } from "../constants";
import { isUnsupportedTab, sendTabToZeeguu } from "../shared/sendTabToZeeguu";
import { BROWSER_API } from "../utils/browserApi";
import { getUserInfoDictFromCookies } from "./cookies";
import { BottomContainer, HeadingContainer, MiddleContainer, NotifyButton, PopUp } from "./Popup.styles";

const STATES = {
  CHECKING: "checking",
  SCRAPING: "scraping",
  UPLOADING: "uploading",
  OPENING: "opening",
  UNSUPPORTED_PAGE: "unsupported_page",
  ERROR: "error",
};

export default function Popup({ loggedIn }) {
  const api = new Zeeguu_API(API_URL);
  const [state, setState] = useState(STATES.CHECKING);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (!loggedIn) return;

    const run = async () => {
      const user = await getUserInfoDictFromCookies(WEB_URL);
      if (!user.session) {
        setState(STATES.ERROR);
        setErrorMessage("Session expired. Please close this popup and click the Zeeguu icon again.");
        return;
      }
      api.session = user.session;

      const [tab] = await BROWSER_API.tabs.query({ active: true, currentWindow: true });
      if (isUnsupportedTab(tab)) {
        setState(STATES.UNSUPPORTED_PAGE);
        return;
      }

      api.logUserActivity(api.OPEN_POPUP, "", tab.url, EXTENSION_SOURCE);

      try {
        setState(STATES.SCRAPING);
        setState(STATES.UPLOADING);
        const upload = await sendTabToZeeguu(api, tab);

        setState(STATES.OPENING);
        await BROWSER_API.tabs.create({ url: `${WEB_URL}/shared-article?upload_id=${upload.id}` });
        window.close();
      } catch (e) {
        console.error("Extension upload flow failed:", e);
        setState(STATES.ERROR);
        setErrorMessage(typeof e === "string" ? e : e?.message || "Could not send this page to Zeeguu.");
      }
    };
    run();
  }, [loggedIn]);

  if (loggedIn === false) {
    return (
      <PopUp>
        <HeadingContainer>
          <img src={logo} alt="Zeeguu logo" />
        </HeadingContainer>
        <MiddleContainer style={{ textAlign: "center" }}>
          <p>Log in to Zeeguu to send articles here.</p>
        </MiddleContainer>
        <BottomContainer>
          <NotifyButton onClick={() => window.open(`${WEB_URL}/log_in`, "_blank")}>Log in</NotifyButton>
        </BottomContainer>
      </PopUp>
    );
  }

  const statusText = {
    [STATES.CHECKING]: "Opening…",
    [STATES.SCRAPING]: "Reading this page…",
    [STATES.UPLOADING]: "Sending to Zeeguu…",
    [STATES.OPENING]: "Opening in Zeeguu…",
    [STATES.UNSUPPORTED_PAGE]: "This page can't be sent to Zeeguu.",
    [STATES.ERROR]: errorMessage,
  }[state];

  return (
    <PopUp>
      <HeadingContainer>
        <img src={logo} alt="Zeeguu logo" />
      </HeadingContainer>
      <MiddleContainer style={{ textAlign: "center" }}>
        <p>{statusText}</p>
      </MiddleContainer>
    </PopUp>
  );
}
