import { useContext, useEffect, useState } from "react";
import { useHistory, useLocation, useParams } from "react-router-dom";
import { APIContext } from "../../contexts/APIContext";
import LoadingAnimation from "../../components/LoadingAnimation";
import ErrorDialog from "../../components/ErrorDialog";

// zeeguu.org/s/<code>: a share link. The code alone names the article and the
// sharer; resolve it and hand over to /read/article?id=…&s=…, which shows the
// reader to logged-in users and the public page to everyone else.
export default function ShortShareLink() {
  const api = useContext(APIContext);
  const history = useHistory();
  const { search } = useLocation();
  const { code } = useParams();
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    api.getArticleShareLinkInfo(
      code,
      null,
      (info) => {
        const params = new URLSearchParams(search); // keeps e.g. source=deeplink
        params.set("id", info.article_id);
        params.set("s", code);
        history.replace(`/read/article?${params}`);
      },
      () => setFailed(true),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [code]);

  if (failed) {
    return (
      <ErrorDialog
        title="Could not open this link"
        message="This share link doesn't exist, or the person who shared it has deleted their account."
        onBack={() => history.replace("/")}
        backLabel="Go to Zeeguu"
      />
    );
  }
  return <LoadingAnimation specificStyle={{ minHeight: "70vh", justifyContent: "center" }} />;
}
