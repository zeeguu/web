import { sendYouTubeTabToZeeguu } from "./sendYouTubeTabToZeeguu";

// Shared YouTube-share entry point for both popup (toolbar-icon click) and
// background (right-click context menu). Captures user details for the
// learning-language hint and returns the URL to open on Zeeguu.
export async function shareYouTubeTab(api, tab, webUrl) {
  const userDetails = await api.getUserDetails();
  const learnedLanguage = userDetails?.learned_language || null;
  const { video_id } = await sendYouTubeTabToZeeguu(api, tab, learnedLanguage);
  return `${webUrl}/shared-video?video_id=${video_id}`;
}
