import CardPage from "./_pages_shared/CardPage";
import Header from "./_pages_shared/Header";
import PageTitle from "./_pages_shared/PageTitle.sc";
import Main from "./_pages_shared/Main.sc";
import { Link } from "react-router-dom";
export default function NotFound() {
  return (
    <CardPage pageWidth={"narrow"} isBackgroundFixed={true}>
      <Header>
        <PageTitle>Ooops!</PageTitle>
      </Header>
      <Main>
        <p>The page you are looking for cannot be found.</p>
        <p>
          <Link to={"/"}>Go back to the homepage</Link>
        </p>
      </Main>
    </CardPage>
  );
}
