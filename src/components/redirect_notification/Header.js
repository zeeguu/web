import * as s from "./RedirectionNotificationModal.sc";

export default function Header({ notificationType }) {
  let zeeguuIcon = (
    <s.IconHeader
      className="fullDivWidthImage"
      alt=""
      src="../static/images/zeeguuLogo.svg"
    ></s.IconHeader>
  );

  let headerContent = {
    unsupportedDesktop: (
      <>
        Your browser doesn't support <br></br> {zeeguuIcon} The Zeeguu Reader
        extension
      </>
    ),

    mobile: <>It looks like you are using&nbsp;a&nbsp;mobile device</>,

    supported: (
      <>
        You are ready to&nbsp;continue<br></br>to the original article's website
      </>
    ),

    supportedNotInstalled: (
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
