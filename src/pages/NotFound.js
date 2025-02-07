import PreferencesPage from "./_pages_shared/PreferencesPage";
import Header from "./_pages_shared/Header";
import Heading from "./_pages_shared/Heading.sc";
import Main from "./_pages_shared/Main.sc";
import { APP_DOMAIN } from "../appConstants";

export default function NotFound() {
  return (
    <PreferencesPage pageWidth={"narrow"}>
      <Header>
        <Heading>Ooops!</Heading>
      </Header>
      <Main>
        <p>The page you are looking for cannot be found.</p>
        <p>
          <a href={APP_DOMAIN}>Go back to the homepage</a>
        </p>
      </Main>
    </PreferencesPage>
  );
}
