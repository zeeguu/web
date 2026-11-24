import { useContext, useEffect, useRef, useState } from "react";
import { useHistory, useLocation } from "react-router-dom";

import { APIContext } from "../contexts/APIContext";
import { readableApiError } from "../utils/misc/readableApiError";
import { PaddedNarrowColumn } from "../components/ColumnWidth.sc";
import LoadingAnimation from "../components/LoadingAnimation";
import FullWidthErrorMsg from "../components/FullWidthErrorMsg.sc";
import BackArrow from "../pages/Settings/SharedComponents/BackArrow";
import strings from "../i18n/definitions";
import { classifySharedText, takePendingSharedText, onSharedText, MAX_SHARED_TEXT_CHARS } from "./sharedText";

// Where a text shared from another app lands (/texts), on its way to the
// reader: a link opens as an article; any other text is kept (it is listed in
// Translate's History from then on) and opened in the text reader.
//
// Text arrives two ways: the native share sheet (usePendingShare hands it over
// through sharedText.js), or the installed web app's share target (?text=).
export default function TextIntake() {
  const api = useContext(APIContext);
  const history = useHistory();
  const location = useLocation();
  const [error, setError] = useState("");
  const handled = useRef(false);

  function bring(text, url = "") {
    const brought = classifySharedText(text, url);
    if (brought.kind === "article") {
      history.replace("/shared-article?url=" + encodeURIComponent(brought.url));
      return;
    }
    if (brought.kind !== "text") {
      // Nothing to read (an empty share, an old link to /texts)
      history.replace("/translate/history");
      return;
    }

    setError("");
    api.addShortText(
      brought.text.slice(0, MAX_SHARED_TEXT_CHARS), // the API keeps at most this much
      {},
      ({ id }) => history.replace(`/texts/read?id=${id}`),
      (errorMessage) => setError(readableApiError(errorMessage, strings.couldNotReadText)),
    );
  }

  useEffect(() => {
    // Once: StrictMode runs this effect twice in development, which would
    // save the text twice, or find nothing the second time and leave
    if (handled.current) return onSharedText((text) => bring(text));
    handled.current = true;

    const params = new URLSearchParams(location.search);
    if (params.has("text") || params.has("url")) {
      // Out of the URL straight away: it would otherwise sit in the history
      // and in error reports.
      history.replace("/texts");
      bring(params.get("text"), params.get("url"));
    } else {
      // A share is handed over before /texts opens, so none waiting means
      // none is coming
      bring(takePendingSharedText() || "");
    }
    return onSharedText((text) => bring(text));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!error) return <LoadingAnimation />;
  return (
    <PaddedNarrowColumn>
      <BackArrow redirectLink="/translate/history" />
      <FullWidthErrorMsg>{error}</FullWidthErrorMsg>
    </PaddedNarrowColumn>
  );
}
