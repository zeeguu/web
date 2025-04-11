import PreferencesPage from "./_pages_shared/PreferencesPage";
import Header from "./_pages_shared/Header";
import Heading from "./_pages_shared/Heading.sc";
import Main from "./_pages_shared/Main.sc";
import { Link } from "react-router-dom";
export default function NotFound() {
  return (
    <PreferencesPage pageWidth={"narrow"}>
      <Header>
        <Heading>Ooops!</Heading>
      </Header>
      <Main>
        <p>The page you are looking for cannot be found.</p>
        <p>
          <Link to={"/"}>Go back to the homepage</Link>
        </p>
      </Main>
    </PreferencesPage>
  );
}
