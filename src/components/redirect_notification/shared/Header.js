import * as s from "../RedirectionNotificationModal.sc";

export default function Header({ children }) {
  return (
    <s.Header>
      <h1>{children}</h1>
    </s.Header>
  );
}
