import { useContext, useEffect, useRef, useState } from "react";
import { Link, useHistory, useLocation } from "react-router-dom";
import CardPage from "../../_pages_shared/CardPage";
import Main from "../../_pages_shared/Main.sc";
import SettingsPageHeader from "../SharedComponents/SettingsPageHeader";
import RadioGroup from "../../../components/RadioGroup/RadioGroup";
import FullWidthErrorMsg from "../../../components/FullWidthErrorMsg.sc";
import FullWidthInfoMsg from "../../../components/FullWidthInfoMsg.sc";
import { setTitle } from "../../../assorted/setTitle";
import { APIContext } from "../../../contexts/APIContext";
import { UserContext } from "../../../contexts/UserContext";
import { SectionDescription } from "./FeedPreferences.sc";
import { GRANDFATHERED_GOAL, nativeShieldAvailable } from "../../../components/nativeShield";
import { languageName } from "../../../utils/misc/languageCodeToName";
import { refreshStudyReminders } from "../../../reminder/useStudyReminder";

// The learner's daily goal (ADR 046): the minutes a day that count the day for
// the streak, and on the phone the minutes after which Aiki leaves the paused
// apps free. New learners start on 5. 2 is not offered: it is only the
// grandfathered goal of learners from before the goal existed.
//
// Each goal says what kind of learner picks it, rather than forecast progress:
// honest forecasts come out in years, which discourages more than it tells.
const GOALS = [
  { minutes: 5, says: (language) => `You haven't ruled out learning ${language}` },
  { minutes: 10, says: () => "You're serious now" },
  { minutes: 15, says: (language) => `${language} is part of your day` },
  { minutes: 20, says: (language) => `You want to speak ${language}` },
];

export default function DailyGoal() {
  const api = useContext(APIContext);
  const { userDetails, userPreferences, setUserPreferences } = useContext(UserContext);
  const history = useHistory();
  // Aiki setup sends the learner here; once they choose, they go back to it.
  const returnAfterChoosing = useLocation().state?.returnAfterChoosing;
  const [error, setError] = useState(false);
  // One save at a time: the choice shown is the one being saved, and a tap
  // while it is under way is ignored.
  const saving = useRef(false);

  useEffect(() => {
    setTitle("Daily goal");
  }, []);

  const current = userPreferences?.daily_goal_minutes;

  const language = languageName(userDetails?.learned_language);
  const options = GOALS.map((goal) => ({
    value: String(goal.minutes),
    label: `${goal.minutes} minutes`,
    description: goal.says(language),
  }));

  function handleChange(e) {
    if (saving.current) return;
    const minutes = e.target.value;
    const before = userPreferences;
    const after = { ...userPreferences, daily_goal_minutes: minutes, daily_goal_set: "true" };
    saving.current = true;
    setError(false);
    // Aiki gets the goal from App, which hands it over whenever it changes.
    setUserPreferences(after);
    api.saveUserPreferences(
      { daily_goal_minutes: minutes },
      () => {
        saving.current = false;
        refreshStudyReminders(); // the server may have just counted today
        if (returnAfterChoosing) history.goBack();
      },
      () => {
        saving.current = false;
        // Unless something newer (logging out) replaced it meanwhile.
        setUserPreferences((current) => (current === after ? before : current));
        setError(true);
      },
    );
  }

  return (
    <CardPage layoutVariant={"card-under-menu"} isTransparent reducedPadding>
      <SettingsPageHeader title="Daily goal" />
      <Main>
        <SectionDescription>
          How long you want to study each day. A day counts for your streak once you reach it.
          {/* Aiki mode exists only in the iPhone app (Screen Time). */}
          {nativeShieldAvailable() && (
            <>
              {" "}
              The goal is also used in <Link to="/account_settings/aiki">Aiki mode</Link>.
            </>
          )}
        </SectionDescription>

        {/* New learners start on the default 5 minutes, shown as their goal.
          Only learners from before the goal existed are asked to choose. */}
        {current === GRANDFATHERED_GOAL && (
          <FullWidthInfoMsg>
            For now your streak counts 2 minutes a day. We think you're more ambitious than that: choose your goal
            below.
          </FullWidthInfoMsg>
        )}

        <RadioGroup
          variant="card"
          name="daily-goal"
          ariaLabel="Daily goal"
          options={options}
          selectedValue={current}
          onChange={handleChange}
          optionId={(option) => `daily-goal-${option.value}`}
          optionValue={(option) => option.value}
          optionLabel={(option) => option.label}
          optionDescription={(option) => option.description}
        />

        {error && <FullWidthErrorMsg>Couldn't save your goal. Please try again.</FullWidthErrorMsg>}
      </Main>
    </CardPage>
  );
}
