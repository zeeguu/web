import { useCallback, useEffect, useState } from "react";

export default function useOnboardingModal(api, messageId) {
  const [open, setOpen] = useState(false);

  const [alreadyShown, setAlreadyShown] = useState(true);

  useEffect(() => {
    let cancelled = false;

    api
      .hasSeenOnboardingMessage(messageId)
      .then((shown) => {
        if (!cancelled) setAlreadyShown(shown);
      })
      .catch(() => {});

    return () => {
      cancelled = true;
    };
  }, [api, messageId]);

  const show = useCallback(() => {
    if (alreadyShown) return;

    setAlreadyShown(true);
    setOpen(true);
    api.markOnboardingMessageShown(messageId).catch(() => {});
  }, [api, messageId, alreadyShown]);

  const close = useCallback(() => setOpen(false), []);

  return { open, show, close, alreadyShown };
}
