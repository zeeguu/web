import { Link, useHistory } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { FormControlLabel, Checkbox } from "@mui/material";
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
import useFormField from "../../../hooks/useFormField";
import { PositiveIntegerValidator } from "../../../utils/ValidatorRule/Validator";
import validateRules from "../../../assorted/validateRules";
import { ExercisesCounterContext } from "../../../exercises/ExercisesCounterContext";

const PREF_KEY_MAX_WORDS_TO_SCHEDULE = "max_words_to_schedule";
const PREF_KEY_FREQUENT_WORDS_FIRST = "frequent_words_first";

export default function ExerciseSchedulingPreferences() {
  const api = useContext(APIContext);
  const { session } = useContext(UserContext);
  const { updateExercisesCounter } = useContext(ExercisesCounterContext);

  const history = useHistory();

  const [maxWordsToSchedule, setMaxWordsToSchedule, validateMaxWords, isMaxWordsValid, maxWordsErrorMessage] =
    useFormField(-1, PositiveIntegerValidator());
  const [frequentWordsFirst, setFrequentWordsFirst] = useState(false);

  useEffect(() => {
    setTitle("Exercise Scheduling");
  }, []);

  useEffect(() => {
    api.getUserPreferences().then((preferences) => {
      setMaxWordsToSchedule(preferences[PREF_KEY_MAX_WORDS_TO_SCHEDULE]);
      setFrequentWordsFirst(preferences[PREF_KEY_FREQUENT_WORDS_FIRST] === "true");
    });
  }, [session, api]);

  function handleSave(e) {
    e.preventDefault();

    if (!validateRules([validateMaxWords])) {
      return;
    }

    api.saveUserPreferences({
      max_words_to_schedule: maxWordsToSchedule,
      frequent_words_first: frequentWordsFirst ? "true" : "false",
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
            <FormControlLabel
              control={
                <Checkbox checked={frequentWordsFirst} onChange={(e) => setFrequentWordsFirst(e.target.checked)} />
              }
              label="Frequent words first"
              sx={{ "& .MuiTypography-root": { fontFamily: "inherit" } }}
            />
            <small>
              A more common word you look up takes the place of a rarer word you have only just started learning.
              Words you are getting right (level 2 and up) keep their place.
            </small>
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
