import * as s from "./InfoPage.sc";

export default function Header({ children }) {
  return (
    <header className="header">
      <img
        src="../static/images/zeeguuLogo.svg"
        alt=""
        style={{ width: "36px" }} //fix inline style
      />
      <h1>{children}</h1>
    </header>
  );
}
