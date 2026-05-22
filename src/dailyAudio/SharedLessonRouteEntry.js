import { useContext } from "react";
import { UserContext } from "../contexts/UserContext";
import AppLayout from "../AppLayout";
import SharedLessonView from "./SharedLessonView";
import PublicSharedLessonPage from "./PublicSharedLessonPage";

// Single entry for /shared-lesson/:id.
// Logged-in users get the rich in-app view (banners, listening sessions);
// anonymous visitors (friends with a share link) get the standalone public
// page with install CTAs. Keeping one URL means a friend who happens to be
// logged in lands in the right place without any redirect dance.
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
