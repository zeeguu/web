import * as s from "./RedirectionNotificationModal.sc";

export default function Body({ notificationType }) {
  function getSmallIcon(src) {
    return (
      <s.Icon>
        <img className="fullDivWidthImage" src={src}></img>
      </s.Icon>
    );
  }

  let BrowserLinks = {
    Chrome: {
      link: "https://www.google.com/chrome/?brand=WHAR&gad_source=1&gclid=EAIaIQobChMI3Z3blfOghAMVD6doCR33SgG1EAAYASAAEgJ6TvD_BwE&gclsrc=aw.ds",
      name: <>Google&nbsp;Chrome</>,
    },
    Firefox: {
      link: "https://www.mozilla.org/en-US/firefox/new/",
      name: <>Mozilla&nbsp;Firefox</>,
    },
    Edge: {
      link: "https://www.microsoft.com/en-us/edge/download?form=MA13FJ",
      name: <>Microsoft&nbsp;Edge</>,
    },
  };

  function renderExternalLink(href, text) {
    return (
      <s.ExternalLink target="_blank" rel="noreferrer" href={href}>
        <s.Strong>{text}</s.Strong>
      </s.ExternalLink>
    );
  }

  const bodyContent = {
    UNSUPPORTED_DESKTOP: (
      <>
        <p>
          To read articles with our extension, we recommend installing{" "}
          {renderExternalLink(
            BrowserLinks.Chrome.link,
            BrowserLinks.Chrome.name
          )}
          ,{" "}
          {renderExternalLink(
            BrowserLinks.Firefox.link,
            BrowserLinks.Firefox.name
          )}
          , or{" "}
          {renderExternalLink(BrowserLinks.Edge.link, BrowserLinks.Edge.name)}.
        </p>
        <br></br>
        <p>
          To read this article with the help of <s.Strong>Zeeguu</s.Strong> on
          your current browser, click
          <s.Strong> Add&nbsp;to&nbsp;Saves</s.Strong> to save it first.
        </p>{" "}
      </>
    ),

    MOBILE: (
      <p>
        If you want to read articles with the help of Zeeguu on your mobile
        device, you need to save them first by clicking the
        <s.Strong> Add&nbsp;to&nbsp;Saves</s.Strong> button.
      </p>
    ),

    SUPPORTED: (
      <>
        <p>
          <s.Strong>Once there</s.Strong>, find and{" "}
          <s.Strong>
            click The Zeeguu Reader{" "}
            {getSmallIcon("../static/images/zeeguuLogo.svg")}
            icon
          </s.Strong>{" "}
          in the top right corner of&nbsp;your browser's toolbar
          or&nbsp;on&nbsp;the&nbsp;list of your installed extensions{" "}
          {getSmallIcon("../static/images/puzzle.svg")}.{" "}
          <s.Strong>Then&nbsp;wait for the reader to open</s.Strong>.
        </p>
        <br></br>
        <img
          className="fullDivWidthImage"
          src={"../static/images/find-extension.png"}
          alt="Zeeguu browser extension"
        />
      </>
    ),

    SUPPORTED_NOT_INSTALLED: (
      <>
        <p>
          For the best user experience we recommend you to read articles with{" "}
          <s.Strong>The Zeeguu Reader</s.Strong> browser extension.
        </p>
        <br></br>
        <p>
          To read this article with the help of Zeeguu without the extension,
          simply click "Add to Saves" above the article’s title.
        </p>
      </>
    ),
  };

  return (
    <>
      <s.Body>
        <p>{bodyContent[notificationType]}</p>
      </s.Body>
    </>
  );
}
