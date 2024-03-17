import * as s from "./InfoPage.sc";

export default function Footer({ children, isLoggedIn }) {
  return (
    <footer className="footer">
      <s.LinkContainer>{children}</s.LinkContainer>
    </footer>
  );
}
