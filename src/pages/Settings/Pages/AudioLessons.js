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
// short") move these a step, so this page also shows where they left them.

// api: lesson_tuning.ANSWER_TIME_CHOICES, more is more time
export const ANSWER_TIMES = [
  { value: "2", label: "Much more", description: "For when you need to think before you speak" },
  { value: "1", label: "More" },
  { value: "0", label: "Normal" },
  { value: "-1", label: "Less" },
  { value: "-2", label: "Much less", description: "For when the answers come quickly" },
];

// api: lesson_tuning.LESSON_MINUTES_CHOICES. A setting of A0 lessons only:
// above A0 the lesson's length follows from its dialogue.
export const LESSON_MINUTES = ["5", "10", "15", "20", "25"];

// At A0 the learner says their own role in the dialogues, and in many
// languages the words depend on who speaks.
const CHARACTERS = [
  { value: "man", label: "A man" },
  { value: "woman", label: "A woman" },
];

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

  useEffect(() => {
    setTitle("Audio lessons");
  }, []);

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

        {/* Sent by the API from api#1002 on, always, as the one in effect. */}
        {userPreferences?.audio_lesson_answer_time != null && (
          <Setting
            name="answer-time"
            heading="Time to answer"
            description="How long the lesson waits for you to say the answer, before it says it. Longer answers get more time."
            options={ANSWER_TIMES}
            value={userPreferences.audio_lesson_answer_time}
            onChange={(value) => save("audio_lesson_answer_time", value)}
          />
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
