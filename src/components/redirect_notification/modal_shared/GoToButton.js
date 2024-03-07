import * as s from "../RedirectionNotificationModal.sc";

export default function GoToButton({ href, target, onClick, children }) {
  return (
    <a target={target} rel="noreferrer" href={href} className="link">
      <s.GoToButton role="button" onClick={onClick}>
        {children}
      </s.GoToButton>
    </a>
  );
}
