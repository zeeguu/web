import { useHistory } from "react-router-dom";
import EmptyState from "../components/EmptyState";
import * as b from "../components/allButtons.sc";
import strings from "../i18n/definitions";

// What the home feed shows a learner at A0 ("Don't know anything"): even the
// easiest texts are beyond them, so instead of a feed that only shows what they
// cannot read yet, it points them to the audio lessons, which start from zero.
// The feed comes back when they choose A1.
export default function NoFeedAtA0() {
  const history = useHistory();
  return (
    <EmptyState title={strings.noFeedAtA0Title} message={strings.noFeedAtA0Message}>
      <div style={{ marginTop: "1.5rem" }}>
        <b.OrangeRoundButton onClick={() => history.push("/daily-audio")}>
          {strings.goToAudioLessons}
        </b.OrangeRoundButton>
      </div>
    </EmptyState>
  );
}
