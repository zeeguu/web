import { useContext, useEffect, useState } from "react";

import { APIContext } from "../contexts/APIContext";
import strings from "../i18n/definitions";

// The learner's texts (shared from another app, pasted or typed into
// Translate), listed in Translate's History with the words they searched.
// Texts come in through TextIntake (a share) or Translate (Translate
// interactively).
export default function useShortTexts() {
  const api = useContext(APIContext);
  const [texts, setTexts] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api.getShortTexts(setTexts, () => setTexts([]));
  }, [api]);

  function forget(id) {
    api.forgetShortText(
      id,
      () => setTexts((current) => current.filter((each) => each.id !== id)),
      () => setError(strings.couldNotRemoveText),
    );
  }

  return { texts, error, forget };
}
