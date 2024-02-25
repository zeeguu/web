import * as s from "./RedirectionNotificationModal.sc";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import FileDownloadRoundedIcon from "@mui/icons-material/FileDownloadRounded";
import {
  runningInChromeDesktop,
  runningInFirefoxDesktop,
} from "../../utils/misc/browserDetection";

export default function SetupForSupportedBrowsers({
  article,
  hasExtension,
  toggleRedirectCheckbox,
  redirectCheckbox,
  handleSaveVisibilityPreferences,
  handleClose,
}) {
  function renderExtensionLinks() {
    let chromeLink =
      "https://chrome.google.com/webstore/detail/the-zeeguu-reader/ckncjmaednfephhbpeookmknhmjjodcd";
    let firefoxLink =
      "https://addons.mozilla.org/en-US/firefox/addon/the-zeeguu-reader/";

    if (runningInChromeDesktop()) {
      return chromeLink;
    }
    if (runningInFirefoxDesktop()) {
      return firefoxLink;
    }
  }

  function renderHeader() {
    let hasExtensionHeader = (
      <h1>
        You are ready to&nbsp;continue<br></br>
        to the original article's website
      </h1>
    );

    let doesNotHaveExtensionHeader = (
      <h1>
        <s.IconHeader
          className="fullDivWidthImage"
          alt=""
          src="../static/images/zeeguuLogo.svg"
        ></s.IconHeader>{" "}
        The Zeeguu Reader<br></br>browser extension is not installed
      </h1>
    );
    console.log(`has extension boolean check: ${hasExtension}`);

    return hasExtension ? hasExtensionHeader : doesNotHaveExtensionHeader;
  }

  // Feature.extension_experiment1()

  function renderBody() {
    let hasExtensionBody = (
      <>
        <p>
          <s.ModalStrongTextWrapper>Once there</s.ModalStrongTextWrapper>, find
          and{" "}
          <s.ModalStrongTextWrapper>
            click The Zeeguu Reader{" "}
            <s.Icon>
              <img
                className="fullDivWidthImage"
                alt=""
                src="../static/images/zeeguuLogo.svg"
              ></img>
            </s.Icon>{" "}
            icon
          </s.ModalStrongTextWrapper>{" "}
          in the top right corner of&nbsp;your browser's toolbar
          or&nbsp;on&nbsp;the&nbsp;list of your installed extensions{" "}
          <s.Icon>
            <img
              className="fullDivWidthImage"
              alt=""
              src="../static/images/puzzle.svg"
            ></img>
          </s.Icon>
          .{" "}
          <s.ModalStrongTextWrapper>
            Then&nbsp;wait for the reader to open
          </s.ModalStrongTextWrapper>
          .
        </p>
        <img
          className="fullDivWidthImage"
          src={"../static/images/find-extension.png"}
          alt="Zeeguu browser extension"
        />
      </>
    );

    let doesNotHaveExtensionBody = (
      <>
        <p>
          For the best user experience we recommend you to read articles with{" "}
          <s.ModalStrongTextWrapper>The Zeeguu Reader</s.ModalStrongTextWrapper>{" "}
          browser extension.
        </p>
        <p>
          To read this article with the help of Zeeguu without the extension,
          simply click "Add to Saves" above the article’s title.
        </p>
      </>
    );

    return hasExtension ? hasExtensionBody : doesNotHaveExtensionBody;
  }

  function renderFooter() {
    let hasExtensionFooter = (
      <>
        <s.CheckboxWrapper>
          <input
            onChange={toggleRedirectCheckbox}
            checked={redirectCheckbox}
            type="checkbox"
            id="checkbox"
            name=""
            value=""
          ></input>{" "}
          <label htmlFor="checkbox">Don't show this message</label>
        </s.CheckboxWrapper>
        {/* Clicking the GoToArticleButton link-button sends the reader
            to the url of the article */}
        <a target="_blank" rel="noreferrer" href={article.url}>
          <s.GoToArticleButton
            role="button"
            // function below saves visibility preferences of the modal and closes it
            onClick={handleSaveVisibilityPreferences}
          >
            Enter the article's website
          </s.GoToArticleButton>
        </a>
      </>
    );
    let doesNotHaveExtensionFooter = (
      <>
        <a
          className="link"
          target="_blank"
          rel="noreferrer"
          href={renderExtensionLinks()}
        >
          <s.GoToArticleButton role="button">
            <FileDownloadRoundedIcon fontSize="small" />
            Install the Extension
          </s.GoToArticleButton>
        </a>
      </>
    );

    return hasExtension ? hasExtensionFooter : doesNotHaveExtensionFooter;
  }

  return (
    <>
      <s.Header>{renderHeader()}</s.Header>
      <s.Body>{renderBody()}</s.Body>
      <s.Footer>{renderFooter()}</s.Footer>
      <s.CloseButton role="button" onClick={handleClose}>
        <CloseRoundedIcon fontSize="medium" />
      </s.CloseButton>
    </>
  );
}
