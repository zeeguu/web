import * as s from "./InfoPage.sc";

export default function Footer({ children, isLoggedIn }) {
  return (
    <s.Footer>
      <s.ButtonContainer oneButton>{children}</s.ButtonContainer>
    </s.Footer>
  );
}
