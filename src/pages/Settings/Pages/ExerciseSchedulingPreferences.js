import { Link, useHistory } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../../contexts/UserContext";
import Button from "../../_pages_shared/Button.sc";
import ButtonContainer from "../../_pages_shared/ButtonContainer.sc";
import Form from "../../_pages_shared/Form.sc";
import FormSection from "../../_pages_shared/FormSection.sc";
import CardPage from "../../_pages_shared/CardPage";
import Main from "../../_pages_shared/Main.sc";
import SettingsPageHeader from "../SharedComponents/SettingsPageHeader";
import strings from "../../../i18n/definitions";
import { setTitle } from "../../../assorted/setTitle";
import { APIContext } from "../../../contexts/APIContext";
import InputField from "../../../components/InputField";
import RadioGroup from "../../../components/RadioGroup/RadioGroup";
import useFormField from "../../../hooks/useFormField";
import { PositiveIntegerValidator } from "../../../utils/ValidatorRule/Validator";
import validateRules from "../../../assorted/validateRules";
import { ExercisesCounterContext } from "../../../exercises/ExercisesCounterContext";

const PREF_KEY_MAX_WORDS_TO_SCHEDULE = "max_words_to_schedule";
const PREF_KEY_WORD_SCHEDULING_STRATEGY = "word_scheduling_strategy";

// The API's UserPreference.WORD_SCHEDULING_STRATEGIES; unset means first_come.
const FIRST_COME = "first_come";
const FREQUENCY_PRIORITY = "frequency_priority";

const STRATEGIES = [
  {
    value: FIRST_COME,
    label: "Finish what I started",
    description: "Words stay in practice until you've learned them.",
  },
  {
    value: FREQUENCY_PRIORITY,
    label: "Most useful words first",
    description: "Common words you look up replace rarer ones you've only just started.",
  },
];

// What the stored value means here: unset or unknown reads as first_come.
function strategyShown(stored) {
  return STRATEGIES.some((option) => option.value === stored) ? stored : FIRST_COME;
}

export default function ExerciseSchedulingPreferences() {
  const api = useContext(APIContext);
  const { session } = useContext(UserContext);
  const { updateExercisesCounter } = useContext(ExercisesCounterContext);

  const history = useHistory();

  const [maxWordsToSchedule, setMaxWordsToSchedule, validateMaxWords, isMaxWordsValid, maxWordsErrorMessage] =
    useFormField(-1, PositiveIntegerValidator());
  const [strategy, setStrategy] = useState(FIRST_COME);
  // As loaded; the choice is sent only when the learner changed it, so that
  // pressing Save for the word count does not pin an unset strategy to the
  // current default.
  const [loadedStrategy, setLoadedStrategy] = useState(FIRST_COME);

  useEffect(() => {
    setTitle("Exercise Scheduling");
  }, []);

  useEffect(() => {
    api.getUserPreferences().then((preferences) => {
      setMaxWordsToSchedule(preferences[PREF_KEY_MAX_WORDS_TO_SCHEDULE]);
      const shown = strategyShown(preferences[PREF_KEY_WORD_SCHEDULING_STRATEGY]);
      setStrategy(shown);
      setLoadedStrategy(shown);
    });
  }, [session, api]);

  function handleSave(e) {
    e.preventDefault();

    if (!validateRules([validateMaxWords])) {
      return;
    }

    const changedStrategy = strategy !== loadedStrategy ? { [PREF_KEY_WORD_SCHEDULING_STRATEGY]: strategy } : {};
    api.saveUserPreferences({
      max_words_to_schedule: maxWordsToSchedule,
      ...changedStrategy,
    });
    history.goBack();
    updateExercisesCounter();
  }

  if (maxWordsToSchedule === -1) {
    return <></>;
  }

  return (
    <CardPage layoutVariant={"card-under-menu"} isTransparent reducedPadding>
      <SettingsPageHeader title="Exercise Scheduling" />
      <Main>
        <Form>
          <FormSection>
            <InputField
              id="max_words_to_schedule"
              type={"number"}
              label={
                <>
                  Words in learning <small>(How many words to study at once)</small>
                </>
              }
              value={maxWordsToSchedule}
              onChange={(e) => {
                setMaxWordsToSchedule(e.target.value);
              }}
              isError={!isMaxWordsValid}
              errorMessage={maxWordsErrorMessage}
            />
            <small>
              Note: If you change the maximum words to a lower number than the number of words that are already
              scheduled, you'll have to remove manually the extra words from the{" "}
              <Link to={"/words"}>Words &gt; In Learning</Link> page or to wait until some of the words will be learned
            </small>
          </FormSection>

          <FormSection>
            <RadioGroup
              variant="card"
              name="word-scheduling-strategy"
              radioGroupLabel="When you look up new words…"
              options={STRATEGIES}
              selectedValue={strategy}
              onChange={(e) => setStrategy(e.target.value)}
              optionId={(option) => `word-scheduling-strategy-${option.value}`}
              optionValue={(option) => option.value}
              optionLabel={(option) => option.label}
              optionDescription={(option) => option.description}
            />
          </FormSection>

          <ButtonContainer className={"adaptive-alignment-horizontal"}>
            <Button type={"submit"} onClick={handleSave}>
              {strings.save}
            </Button>
          </ButtonContainer>
        </Form>
      </Main>
    </CardPage>
  );
}
