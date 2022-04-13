import { Link } from "react-router-dom";

export default function ExtensionInstalled() {
  return (
    <>
      <h1>Congratulations</h1>
      <p>Don't forget to pin the extension</p>
      <Link to="/articles">Go to articles</Link>
    </>
  );
}
