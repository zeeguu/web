import * as s from "./GoToButton.sc";

export default function GoToButton({ onClick, children }) {
  return (
    <s.GoToButton role="button" onClick={onClick}>
      {children}
    </s.GoToButton>
  );
}
