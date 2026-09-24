import { useContext, useEffect, useState } from "react";
import { Redirect, useParams } from "react-router-dom";
import { APIContext } from "../../contexts/APIContext";
import { UserContext } from "../../contexts/UserContext";
import { PrivateRouteWithLayout } from "../../PrivateRouteWithLayout";
import LoadingAnimation from "../../components/LoadingAnimation";
import ErrorDialog from "../../components/ErrorDialog";
import useQuery from "../../hooks/useQuery";
import ArticleReader from "../ArticleReader";
import PublicSharedArticlePage from "./PublicSharedArticlePage";

const loading = <LoadingAnimation specificStyle={{ minHeight: "70vh", justifyContent: "center" }} />;

// /read/<code>: the article's link. The same URL is what a logged-in reader
// sees in the address bar and what the Share button copies. Logged in: the
// reader. Otherwise: the public page.
export function ArticleLinkRouteEntry() {
  const api = useContext(APIContext);
  const { session } = useContext(UserContext);
  const { code } = useParams();
  const [info, setInfo] = useState(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (!session) return; // the public page resolves the link itself
    setInfo(null);
    setFailed(false);
    api.getArticleLinkInfo(code, setInfo, () => setFailed(true));
  }, [api, session, code]);

  if (!session) return <PublicSharedArticlePage link={code} />;
  if (failed) return <UnknownLink />;
  if (!info) return loading;
  return (
    <PrivateRouteWithLayout path="/read/:code" component={ArticleReader} articleId={String(info.article_id)} />
  );
}

// /read/article?id=<id>: in-app navigation and older links. Logged in: the
// reader, which then rewrites the address bar to the article's link. Logged
// out: login, as before -- a numeric id opens nothing publicly. Exception: the
// ?id=…&s=<code> links handed out on 2026-09-23, which redirect to today's link.
export default function ReadArticleRouteEntry(props) {
  const query = useQuery();
  if (query.get("s") && query.get("id")) return <LegacyShareLinkRedirect code={query.get("s")} articleId={query.get("id")} />;
  return <PrivateRouteWithLayout {...props} component={ArticleReader} />;
}

function LegacyShareLinkRedirect({ code, articleId }) {
  const api = useContext(APIContext);
  const [link, setLink] = useState(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    api.resolveLegacyShareLink(code, articleId, (data) => setLink(data.code), () => setFailed(true));
  }, [api, code, articleId]);

  if (failed) return <UnknownLink />;
  if (!link) return loading;
  return <Redirect to={`/read/${link}`} />;
}

function UnknownLink() {
  return (
    <ErrorDialog
      title="Could not open this link"
      message="This link doesn't point to an article on Zeeguu."
      onBack={() => window.location.replace("/")}
      backLabel="Go to Zeeguu"
    />
  );
}
