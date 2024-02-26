import * as s from "./RedirectionNotificationModal.sc";

export default function Header({ notificationType }) {
  let zeeguuIcon = (
    <s.IconHeader
      className="fullDivWidthImage"
      src="../static/images/zeeguuLogo.svg"
    ></s.IconHeader>
  );

  let headerContent = {
    UNSUPPORTED_DESKTOP: (
      <>
        Your browser doesn't support <br></br> {zeeguuIcon} The Zeeguu Reader
        extension
      </>
    ),

    MOBILE: <>It looks like you are using&nbsp;a&nbsp;mobile device</>,

    SUPPORTED: (
      <>
        You are ready to&nbsp;continue<br></br>to the original article's website
      </>
    ),

    SUPPORTED_NOT_INSTALLED: (
      <>
        {zeeguuIcon} The Zeeguu Reader<br></br>browser extension is not
        installed
      </>
    ),
  };

  return (
    <>
      <s.Header>
        <h1>{headerContent[notificationType]}</h1>
      </s.Header>
    </>
  );
}
