import { useContext } from "react";
import { UserContext } from "../../contexts/UserContext";
import { PrivateRouteWithLayout } from "../../PrivateRouteWithLayout";
import ArticleReader from "../ArticleReader";
import PublicSharedArticlePage from "./PublicSharedArticlePage";

// /read/article is the link people share. Logged-in readers get the full
// reader; everyone else gets the public read-only page instead of the login
// wall (same fork as SharedLessonRouteEntry).
export default function ReadArticleRouteEntry(props) {
  const { session } = useContext(UserContext);
  if (session) return <PrivateRouteWithLayout {...props} component={ArticleReader} />;
  return <PublicSharedArticlePage />;
}
