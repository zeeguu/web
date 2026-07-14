import { ThemeProvider } from "styled-components";
import { mainNavTheme } from "../components/MainNav/mainNavTheme";
import * as s from "../AppLayout.sc";

// A stripped-down AppLayout for kiosk mode: the same scrollable content
// container (id="scrollHolder" — the reader's scroll tracking and
// scroll-to-position depend on it), but no SideNav / TopBar / BottomNav.
export default function KioskLayout({ children }) {
  return (
    <ThemeProvider theme={mainNavTheme.student}>
      <s.AppLayout>
        <s.AppContent id="scrollHolder">{children}</s.AppContent>
      </s.AppLayout>
    </ThemeProvider>
  );
}
