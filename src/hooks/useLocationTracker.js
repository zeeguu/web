import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import LocalStorage from "../assorted/LocalStorage";

/* This custom hook tracks the current page location and stores it in localStorage
   so users can be returned to their last visited page after logging in */
export default function useLocationTracker() {
  console.log('useLocationTracker - HOOK CALLED');
  
  const location = useLocation();
  console.log('useLocationTracker - useLocation result:', location);

  useEffect(() => {
    console.log('useLocationTracker - useEffect running');
    // Only track specific main pages
    const pathname = location.pathname;
    console.log('Location tracker - current pathname:', pathname);
    
    if (pathname && 
        (pathname.startsWith('/articles') || 
         pathname.startsWith('/exercises') || 
         pathname.startsWith('/daily-audio'))) {
      
      console.log('Location tracker - saving page:', pathname);
      LocalStorage.setLastVisitedPage(pathname);
    }
  }, [location]);

  console.log('useLocationTracker - returning null');
  return null; // This hook doesn't render anything
}