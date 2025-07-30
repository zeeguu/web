import { useState, useEffect } from "react";
import redirect from "../utils/routing/routing";
import LocalStorage from "../assorted/LocalStorage";

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
    if (existingRedirectLink) {
      redirect(existingRedirectLink);
    } else {
      // Check if there's a previously visited page to return to
      const lastVisitedPage = LocalStorage.getLastVisitedPage();
      if (lastVisitedPage && lastVisitedPage !== linkToRedirect) {
        redirect(lastVisitedPage);
      } else {
        redirect(linkToRedirect);
      }
    }
  }
  return { handleRedirectLinkOrGoTo };
}
