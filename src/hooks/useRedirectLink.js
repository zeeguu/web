import { useState, useEffect } from "react";
import redirect from "../utils/routing/routing";

/* This custom hook is meant to be used for redirecting
on pages that should support redirect links */
export default function useRedirectLink() {
  const [existingRedirectLink, setExistingRedirectLink] = useState(null);

  //check for existing redirect links
  useEffect(() => {
    const queryParameters = new URLSearchParams(window.location.search);
    setExistingRedirectLink(queryParameters.get("redirectLink"));
  }, []);

  function handleRedirectLinkOrGoTo(linkToRedirect) {
    existingRedirectLink
      ? redirect(existingRedirectLink)
      : redirect(linkToRedirect);
  }
  return { handleRedirectLinkOrGoTo };
}
