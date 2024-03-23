import * as s from "./Modal.sc";

export default function GoToButton({ href, target, onClick, children }) {
  return (
    <a target={target} rel="noopener noreferrer" href={href} className="link">
      <s.GoToButton role="button" onClick={onClick}>
        {children}
      </s.GoToButton>
    </a>
  );
}
