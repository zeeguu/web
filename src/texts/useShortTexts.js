import { useCallback, useContext, useEffect, useState } from "react";

import { APIContext } from "../contexts/APIContext";
import strings from "../i18n/definitions";

// The learner's texts (shared from another app, pasted or typed into
// Translate), listed in Translate's History with the words they searched.
// Texts come in through TextIntake (a share) or Translate (Translate
// interactively).
export default function useShortTexts(pageSize = 20) {
  const api = useContext(APIContext);
  const [texts, setTexts] = useState(null);
  const [hasMore, setHasMore] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    api.getShortTexts(
      (page) => {
        setTexts(page);
        setHasMore(page.length === pageSize);
      },
      () => {
        setTexts([]);
        setHasMore(false);
      },
      { limit: pageSize, offset: 0 },
    );
  }, [api, pageSize]);

  const loadMore = useCallback(
    () =>
      new Promise((resolve) => {
        const offset = texts ? texts.length : 0;
        api.getShortTexts(
          (page) => {
            setTexts((current) => {
              const seen = new Set((current || []).map((t) => t.id));
              return [...(current || []), ...page.filter((t) => !seen.has(t.id))];
            });
            setHasMore(page.length === pageSize);
            resolve();
          },
          () => {
            setHasMore(false);
            resolve();
          },
          { limit: pageSize, offset },
        );
      }),
    [api, pageSize, texts],
  );

  function forget(id) {
    api.forgetShortText(
      id,
      () => setTexts((current) => current.filter((each) => each.id !== id)),
      () => setError(strings.couldNotRemoveText),
    );
  }

  return { texts, error, hasMore, loadMore, forget };
}
