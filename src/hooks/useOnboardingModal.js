import { useCallback, useEffect, useState } from "react";

export default function useOnboardingModal(api, messageId) {
  const [open, setOpen] = useState(false);

  // Fail-safe default: assume already-shown until the backend says otherwise.
  // This prevents the modal from flashing on initial render before the status
  // check returns.
  const [alreadyShown, setAlreadyShown] = useState(true);

  useEffect(() => {
    // `cancelled` guards against the user logging out (or messageId changing)
    // while this network request is still in flight — see the cleanup below.
    let cancelled = false;

    api
      .hasSeenOnboardingMessage(messageId)
      .then((shown) => {
        // Skip the state update if the effect was torn down before we resolved.
        // Otherwise we'd warn about setting state on an unmounted component,
        // or write the wrong message's status into state.
        if (!cancelled) setAlreadyShown(shown);
      })
      .catch(() => {});

    // Cleanup. React calls this when deps change or the component unmounts;
    // we flip the flag so the .then() above becomes a no-op.
    return () => {
      cancelled = true;
    };
  }, [api, messageId]);

  const show = useCallback(() => {
    if (alreadyShown) return; // no-op: either unknown or already shown

    setAlreadyShown(true);
    setOpen(true);
    api.markOnboardingMessageShown(messageId).catch(() => {});
  }, [api, messageId, alreadyShown]);

  const close = useCallback(() => setOpen(false), []);

  return { open, show, close, alreadyShown };
}
