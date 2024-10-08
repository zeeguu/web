/**
 * Redirects the browser to a specified URL, either in the same window or a new tab/window.
 *
 * @param {string} linkToRedirect - The URL to navigate to.
 * @param {boolean} [openInNewWindow=false] - If true, opens the URL in a new tab/window;
 *                                            if false or not provided, navigates in the same window.
 *
 * @returns {void}
 *
 * Usage:
 *  - redirect('https://example.com');         // Opens in the same window.
 *  - redirect('https://example.com', true);   // Opens in a new window/tab.
 */

export default function redirect(linkToRedirect, openInNewWindow = false) {
  if (openInNewWindow) {
    window.open(linkToRedirect, "_blank", "noopener,noreferrer");
  } else {
    window.location.href = linkToRedirect;
  }
}
