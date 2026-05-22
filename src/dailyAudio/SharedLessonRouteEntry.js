import { useContext } from "react";
import { UserContext } from "../contexts/UserContext";
import AppLayout from "../AppLayout";
import SharedLessonView from "./SharedLessonView";
import PublicSharedLessonPage from "./PublicSharedLessonPage";

// Logged-in users get the in-app view; anonymous visitors get the public
// page with install CTAs. One URL works for both.
export default function SharedLessonRouteEntry() {
  const { session } = useContext(UserContext);

  if (session) {
    return (
      <AppLayout>
        <SharedLessonView />
      </AppLayout>
    );
  }

  return <PublicSharedLessonPage />;
}
