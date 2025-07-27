import { Link, useHistory } from "react-router-dom";
import { useContext, useEffect } from "react";
import { UserContext } from "../../contexts/UserContext";
import Button from "../_pages_shared/Button.sc";
import ButtonContainer from "../_pages_shared/ButtonContainer.sc";
import Form from "../_pages_shared/Form.sc";
import FormSection from "../_pages_shared/FormSection.sc";
import PreferencesPage from "../_pages_shared/PreferencesPage";
import Main from "../_pages_shared/Main.sc";
import Header from "../_pages_shared/Header";
import Heading from "../_pages_shared/Heading.sc";
import BackArrow from "./settings_pages_shared/BackArrow";
import strings from "../../i18n/definitions";
import { setTitle } from "../../assorted/setTitle";
import { APIContext } from "../../contexts/APIContext";
import InputField from "../../components/InputField";
import useFormField from "../../hooks/useFormField";
import { PositiveIntegerValidator } from "../../utils/ValidatorRule/Validator";
import validateRules from "../../assorted/validateRules";
import { ExercisesCounterContext } from "../../exercises/ExercisesCounterContext";

const PREF_KEY_MAX_WORDS_TO_SCHEDULE = "max_words_to_schedule";

export default function ExerciseSchedulingPreferences() {
  const api = useContext(APIContext);
  const { session } = useContext(UserContext);
  const { updateExercisesCounter } = useContext(ExercisesCounterContext);

  const history = useHistory();

  const [maxWordsToSchedule, setMaxWordsToSchedule, validateMaxWords, isMaxWordsValid, maxWordsErrorMessage] =
    useFormField(-1, PositiveIntegerValidator());

  useEffect(() => {
    setTitle("Exercise Scheduling");
  }, []);

  useEffect(() => {
    api.getUserPreferences((preferences) => {
      setMaxWordsToSchedule(preferences[PREF_KEY_MAX_WORDS_TO_SCHEDULE]);
    });
  }, [session, api]);

  function handleSave(e) {
    e.preventDefault();

    if (!validateRules([validateMaxWords])) {
      return;
    }

    api.saveUserPreferences({
      max_words_to_schedule: maxWordsToSchedule,
    });
    history.goBack();
    updateExercisesCounter();
  }

  if (maxWordsToSchedule === -1) {
    return <></>;
  }

  return (
    <PreferencesPage layoutVariant={"minimalistic-top-aligned"}>
      <BackArrow />
      <Header withoutLogo>
        <Heading>Exercise Scheduling</Heading>
      </Header>
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
              <Link to={"/words"}>Words > In Learning</Link> page or to wait until some of the words will be learned
            </small>
          </FormSection>

          <ButtonContainer className={"adaptive-alignment-horizontal"}>
            <Button type={"submit"} onClick={handleSave}>
              {strings.save}
            </Button>
          </ButtonContainer>
        </Form>
      </Main>
    </PreferencesPage>
  );
}
