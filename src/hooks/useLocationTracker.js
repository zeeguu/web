import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import LocalStorage from "../assorted/LocalStorage";

/* This custom hook tracks the current page location and stores it in localStorage
   so users can be returned to their last visited page after logging in */
export default function useLocationTracker() {
  const location = useLocation();

  useEffect(() => {
    // Only track specific main pages
    const pathname = location.pathname;
    if (pathname && 
        (pathname.startsWith('/articles') ||
         pathname.startsWith('/exercises') || 
         pathname.startsWith('/daily-audio'))) {
      
      LocalStorage.setLastVisitedPage(pathname);
    }
  }, [location]);

  return null; // This hook doesn't render anything
}