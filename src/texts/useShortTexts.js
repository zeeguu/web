import { useContext, useEffect, useState } from "react";
import { useHistory, useLocation } from "react-router-dom";

import { APIContext } from "../contexts/APIContext";
import { readableApiError } from "../utils/misc/readableApiError";
import strings from "../i18n/definitions";
import { classifySharedText, takePendingSharedText, onSharedText, MAX_SHARED_TEXT_CHARS } from "./sharedText";

// The short texts the learner brings in (shared from another app, e.g. a
// WhatsApp message, or pasted), shown in Inbox with what friends share.
// Taking a text in: a link opens as an article; any other text is kept and
// opened in the text reader.
//
// Text arrives three ways: the native share sheet (index.js puts it in the
// pending store), the installed web app's share target (?text=, which /texts
// passes on to here), or pasting from the clipboard.
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

  // For a text that is easier to copy than to share. The clipboard is read
  // only on the tap: the browser (and the iOS app's web view) allows it then,
  // and asks nothing up front. Whether it holds text cannot be known before,
  // so the button is always there, and says so when there is nothing.
  async function pasteFromClipboard() {
    setError("");
    try {
      const text = await navigator.clipboard.readText();
      // The API keeps at most this much of a text.
      if (text && text.trim()) bring(text.slice(0, MAX_SHARED_TEXT_CHARS));
      else setError(strings.nothingToPaste);
    } catch {
      setError(strings.nothingToPaste);
    }
  }

  return { texts, isAdding, error, forget, pasteFromClipboard };
}
