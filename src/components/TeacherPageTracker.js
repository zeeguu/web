import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import LocalStorage from "../assorted/LocalStorage";

/**
 * Component that tracks which teacher page the user is on
 * and stores it in localStorage so we can navigate back to it
 * when switching from student to teacher mode.
 */
export default function TeacherPageTracker() {
  const location = useLocation();

  useEffect(() => {
    // Only track /teacher/texts and /teacher/classes pages
    if (location.pathname.startsWith("/teacher/texts") ||
        location.pathname.startsWith("/teacher/classes")) {
      // Store just the base path (/teacher/texts or /teacher/classes)
      const basePath = location.pathname.startsWith("/teacher/texts")
        ? "/teacher/texts"
        : "/teacher/classes";
      LocalStorage.setLastVisitedTeacherPage(basePath);
    }
  }, [location.pathname]);

  return null; // This component doesn't render anything
}
