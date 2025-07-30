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
    console.log('Redirect logic - existingRedirectLink:', existingRedirectLink);
    console.log('Redirect logic - linkToRedirect:', linkToRedirect);
    
    if (existingRedirectLink) {
      console.log('Redirect logic - using existing redirect link:', existingRedirectLink);
      redirect(existingRedirectLink);
    } else {
      // Check if there's a previously visited page to return to
      const lastVisitedPage = LocalStorage.getLastVisitedPage();
      console.log('Redirect logic - lastVisitedPage from localStorage:', lastVisitedPage);
      
      if (lastVisitedPage && lastVisitedPage !== linkToRedirect) {
        console.log('Redirect logic - redirecting to last visited page:', lastVisitedPage);
        redirect(lastVisitedPage);
      } else {
        console.log('Redirect logic - redirecting to default:', linkToRedirect);
        redirect(linkToRedirect);
      }
    }
  }
  return { handleRedirectLinkOrGoTo };
}
