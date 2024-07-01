import * as s from "./WarningButton.sc";

export default function WarningButton({ href, target, onClick, children }) {
  return (
    <a target={target} rel="noopener noreferrer" href={href} className="link">
      <s.WarningButton role="button" onClick={onClick}>
        {children}
      </s.WarningButton>
    </a>
  );
}
