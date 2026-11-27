import { useContext, useEffect, useState } from "react";
import CardPage from "../../_pages_shared/CardPage";
import Main from "../../_pages_shared/Main.sc";
import SettingsPageHeader from "../SharedComponents/SettingsPageHeader";
import RadioGroup from "../../../components/RadioGroup/RadioGroup";
import FullWidthErrorMsg from "../../../components/FullWidthErrorMsg.sc";
import { setTitle } from "../../../assorted/setTitle";
import { APIContext } from "../../../contexts/APIContext";
import { UserContext } from "../../../contexts/UserContext";
import { SectionHeading, SectionDescription } from "./FeedPreferences.sc";
import { savePreferences } from "../../../utils/preferences/savePreferences";
import { isA0Learner } from "../../../utils/misc/userCefrLevel";

// How the daily audio lessons are said, set once and rarely changed. What the
// next lesson is about (its type, topic or situation) is chosen in the lesson's
// own settings dialog instead. The answers after a lesson ("Too fast", "Too
// much") move these a step, so this page also shows where they left them.
// Each step says what the learner will hear, in seconds and times at their
// level, as the API labels it (GET audio_lesson_settings).

// api: lesson_tuning.LESSON_MINUTES_CHOICES. A setting of A0 lessons only:
// above A0 the lesson's length follows from its dialogue.
const LESSON_MINUTES = ["5", "10", "15", "20", "25"];

// At A0 the learner says their own role in the dialogues, and in many
// languages the words depend on who speaks.
const CHARACTERS = [
  { value: "man", label: "A man" },
  { value: "woman", label: "A woman" },
];

const capitalized = (text) => text.charAt(0).toUpperCase() + text.slice(1);

function Setting({ name, heading, description, options, value, onChange }) {
  return (
    <>
      <SectionHeading>{heading}</SectionHeading>
      {description && <SectionDescription>{description}</SectionDescription>}
      <RadioGroup
        variant="card"
        name={name}
        ariaLabel={heading}
        options={options}
        selectedValue={value}
        onChange={(e) => onChange(e.target.value)}
        optionId={(option) => `${name}-${option.value}`}
        optionValue={(option) => option.value}
        optionLabel={(option) => option.label}
        optionDescription={(option) => option.description}
      />
    </>
  );
}

export default function AudioLessons() {
  const api = useContext(APIContext);
  const { userDetails, userPreferences, setUserPreferences } = useContext(UserContext);
  const a0 = isA0Learner(userDetails);
  const [error, setError] = useState(false);
  // null until loaded; stays null with an API from before the endpoint
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    setTitle("Audio lessons");
    api.getAudioLessonSettings(setSettings, () => {});
  }, [api]);

  // A step of a setting from the endpoint: shown at once, then saved
  function choose(setting, key, value) {
    setSettings((current) => ({ ...current, [setting]: { ...current[setting], value } }));
    save(key, value);
  }

  function save(key, value) {
    setError(false);
    savePreferences({
      api,
      preferences: userPreferences,
      setUserPreferences,
      changes: { [key]: value },
      onFailed: () => setError(true),
    });
  }

  return (
    <CardPage layoutVariant={"card-under-menu"} isTransparent reducedPadding>
      <SettingsPageHeader title="Audio lessons" />
      <Main>
        <SectionDescription>
          How your daily audio lessons are said. What they are about you choose under Next lesson settings, on the
          Listen page.
        </SectionDescription>

        {settings && (
          <>
            <Setting
              name="answer-time"
              heading="Time to answer"
              description="How long the lesson waits for you to say the answer, before it says it: short answers get the lower number, long ones the higher."
              options={settings.answer_time.choices}
              value={settings.answer_time.value}
              onChange={(value) => choose("answer_time", "audio_lesson_answer_time", value)}
            />
            <Setting
              name="repetition"
              heading="Repetition"
              options={settings.repetition.choices.map((choice) => ({ ...choice, label: capitalized(choice.label) }))}
              value={settings.repetition.value}
              onChange={(value) => choose("repetition", "audio_lesson_repetition", value)}
            />
          </>
        )}

        {a0 && userPreferences?.audio_lesson_minutes && (
          <Setting
            name="lesson-length"
            heading="Lesson length"
            options={LESSON_MINUTES.map((minutes) => ({ value: minutes, label: `About ${minutes} minutes` }))}
            value={userPreferences.audio_lesson_minutes}
            onChange={(value) => save("audio_lesson_minutes", value)}
          />
        )}

        {a0 && (
          <Setting
            name="character"
            heading="In the dialogues you speak as"
            description="In many languages the words you say depend on it."
            options={CHARACTERS}
            value={userPreferences?.audio_lesson_character}
            onChange={(value) => save("audio_lesson_character", value)}
          />
        )}

        {error && <FullWidthErrorMsg>Couldn't save this. Please try again.</FullWidthErrorMsg>}
      </Main>
    </CardPage>
  );
}
