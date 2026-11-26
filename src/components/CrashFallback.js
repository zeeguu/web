import EmptyState from "./EmptyState";
import { StyledButton } from "./allButtons.sc";
import strings from "../i18n/definitions";

// Shown by the top-level error boundary instead of an empty page. A full
// reload of "/" rather than a router push: the router state is part of what
// crashed, and the reload starts every context afresh.
export default function CrashFallback({ onBackToHome = () => window.location.replace("/") }) {
  return (
    <EmptyState title={strings.somethingWentWrong} message={strings.crashMessage}>
      <StyledButton $primary style={{ marginTop: "1.5rem" }} onClick={onBackToHome}>
        {strings.backToHome}
      </StyledButton>
    </EmptyState>
  );
}
