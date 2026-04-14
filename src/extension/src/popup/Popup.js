/*global chrome*/
import { Readability } from "@mozilla/readability";
import { useEffect, useState } from "react";

import logo from "../../../../public/static/images/zeeguu128.png";
import Zeeguu_API from "../../../api/Zeeguu_API";
import { API_URL, WEB_URL } from "../../../config";
import { EXTENSION_SOURCE } from "../constants";
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

async function scrapeActiveTab(tab) {
  const [result] = await BROWSER_API.scripting.executeScript({
    target: { tabId: tab.id },
    func: () => {
      const htmlClone = document.documentElement.cloneNode(true);
      return {
        url: document.location.href,
        rawHtml: htmlClone.outerHTML,
      };
    },
  });
  const { url, rawHtml } = result.result;

  const doc = new DOMParser().parseFromString(rawHtml, "text/html");
  const base = doc.createElement("base");
  base.href = url;
  doc.head.prepend(base);

  const article = new Readability(doc).parse();
  if (!article) throw new Error("Readability could not extract an article from this page.");

  const ogImage = doc.querySelector('meta[property="og:image"]')?.getAttribute("content") || null;

  return {
    url,
    rawHtml,
    textContent: article.textContent,
    title: article.title,
    author: article.byline,
    imageUrl: ogImage,
  };
}

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
      if (!tab?.url || /^chrome(-extension)?:\/\//.test(tab.url) || tab.url.includes("zeeguu.org")) {
        setState(STATES.UNSUPPORTED_PAGE);
        return;
      }

      api.logUserActivity(api.OPEN_POPUP, "", tab.url, EXTENSION_SOURCE);

      try {
        setState(STATES.SCRAPING);
        const scraped = await scrapeActiveTab(tab);

        setState(STATES.UPLOADING);
        const upload = await new Promise((resolve, reject) =>
          api.createArticleUpload(
            {
              url: scraped.url,
              raw_html: scraped.rawHtml,
              text_content: scraped.textContent,
              title: scraped.title || "",
              image_url: scraped.imageUrl || "",
              author: scraped.author || "",
            },
            resolve,
            reject,
          ),
        );

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
