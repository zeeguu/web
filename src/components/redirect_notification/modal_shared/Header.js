import * as s from "./Modal.sc";

export default function Header({ children }) {
  return (
    <s.Header>
      <h1>{children}</h1>
    </s.Header>
  );
}
