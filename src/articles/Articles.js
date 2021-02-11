import NewArticles from "./NewArticles";
import BookmarkedArticles from "./BookmarkedArticles";
import { TopTab, SeparatorBar } from "../components/TopTab";
import { PrivateRoute } from "../PrivateRoute";
import Search from "./Search";
import ClassroomArticles from "./ClassroomArticles";
import * as s from "./Articles.sc";

export default function Articles({ api }) {
  return (
    <s.Articles>
      <s.TopTabs>
        <div className="select-article">
          <h1>Articles</h1>

          <div className="all__tabs">
            <TopTab text="New" link="/articles" />

            <SeparatorBar />

            <TopTab text="Bookmarked" link="/articles/bookmarked" />

            <SeparatorBar />

            <TopTab text="Classroom" link="/articles/classroom" />
          </div>
        </div>
      </s.TopTabs>

      <PrivateRoute path="/articles" exact zapi={api} component={NewArticles} />

      <PrivateRoute
        path="/articles/search/:term"
        zapi={api}
        component={Search}
      />

      <PrivateRoute
        path="/articles/bookmarked"
        zapi={api}
        component={BookmarkedArticles}
      />

      <PrivateRoute
        path="/articles/classroom"
        zapi={api}
        component={ClassroomArticles}
      />
    </s.Articles>
  );
}
