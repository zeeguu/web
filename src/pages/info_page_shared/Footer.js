import * as s from "./InfoPage.sc";

export default function Footer({ children, isLoggedIn }) {
  return (
    <s.Footer>
      <s.LinkContainer>{children}</s.LinkContainer>
    </s.Footer>
  );
}
