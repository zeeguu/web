import { useState, useEffect } from "react";
import redirect from "../utils/routing/routing";

export default function useRedirectLink() {
  const [existingRedirectLink, setExistingRedirectLink] = useState(null);

  //check for existing redirect links
  useEffect(() => {
    const queryParameters = new URLSearchParams(window.location.search);
    setExistingRedirectLink(queryParameters.get("redirectLink"));
  }, []);

  function handleRedirect(linkToRedirect) {
    existingRedirectLink
      ? redirect(existingRedirectLink)
      : redirect(linkToRedirect);
  }
  return { handleRedirect };
}
