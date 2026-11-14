import { useContext, useEffect, useState } from "react";
import { useHistory, useLocation } from "react-router-dom";

import { APIContext } from "../contexts/APIContext";
import { readableApiError } from "../utils/misc/readableApiError";
import strings from "../i18n/definitions";
import { classifySharedText, takePendingSharedText, onSharedText } from "./sharedText";

// The short texts the learner brings in (shared from another app, e.g. a
// WhatsApp message), shown in Inbox with what friends share.
// Taking a text in: a link opens as an article; any other text is kept and
// opened in the text reader.
//
// Text arrives two ways: the native share sheet (index.js puts it in the
// pending store), or the installed web app's share target (?text=, which
// /texts passes on to here).
export const INBOX_PATH = "/articles/shared";

export default function useShortTexts() {
  const api = useContext(APIContext);
  const history = useHistory();
  const location = useLocation();

  const [texts, setTexts] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    api.getShortTexts(setTexts, () => setTexts([]));
  }, [api]);

  function bring(text, url = "") {
    const brought = classifySharedText(text, url);
    if (brought.kind === "article") {
      history.push("/shared-article?url=" + encodeURIComponent(brought.url));
      return;
    }
    if (brought.kind !== "text") return;

    setError("");
    setIsAdding(true);
    api.addShortText(
      brought.text,
      {},
      ({ id }) => history.push(`/texts/read?id=${id}`),
      (errorMessage) => {
        setIsAdding(false);
        setError(readableApiError(errorMessage, strings.couldNotReadText));
      },
    );
  }

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.has("text") || params.has("url")) {
      // Out of the URL straight away: it would otherwise sit in the history
      // and in error reports.
      history.replace(INBOX_PATH);
      bring(params.get("text"), params.get("url"));
    }

    const pending = takePendingSharedText();
    if (pending) bring(pending);
    return onSharedText((text) => bring(text));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function forget(id) {
    api.forgetShortText(
      id,
      () => setTexts((current) => current.filter((each) => each.id !== id)),
      () => setError(strings.couldNotRemoveText),
    );
  }

  return { texts, isAdding, error, forget };
}
