import { useHistory } from "react-router-dom";
import { useState, useEffect, useContext } from "react";
import { UserContext } from "../../contexts/UserContext";
import SessionStorage from "../../assorted/SessionStorage";
import LocalStorage from "../../assorted/LocalStorage";
import Feature from "../../features/Feature";
import { Button } from "../_pages_shared/Button.sc";
import { ButtonContainer } from "../_pages_shared/ButtonContainer.sc";
import { Form } from "../_pages_shared/Form.sc";
import { FormSection } from "../_pages_shared/FormSection.sc";
import PreferencesPage from "../_pages_shared/PreferencesPage";
import { Main } from "../_pages_shared/Main.sc";
import Header from "../_pages_shared/Header";
import { Heading } from "../_pages_shared/Heading.sc";
import BackArrow from "./settings_pages_shared/BackArrow";
import Checkbox from "../../components/modal_shared/Checkbox";
import strings from "../../i18n/definitions";
import { setTitle } from "../../assorted/setTitle";

export default function ExerciseTypePreferences({ api }) {
  const user = useContext(UserContext);
  const history = useHistory();

  const [audioExercises, setAudioExercises] = useState(true);
  let preferenceNotSet =
    LocalStorage.getProductiveExercisesEnabled() === undefined;

  const [productiveExercises, setProductiveExercises] = useState(
    preferenceNotSet || LocalStorage.getProductiveExercisesEnabled(),
  );

  useEffect(() => {
    setTitle(strings.exerciseTypePreferences);
  }, []);

  useEffect(() => {
    api.getUserPreferences((preferences) => {
      setAudioExercises(
        (preferences["audio_exercises"] === undefined ||
          preferences["audio_exercises"] === "true") &&
          SessionStorage.isAudioExercisesEnabled(),
      );
    });
  }, [user.session, api]);

  function handleAudioExercisesChange(e) {
    setAudioExercises((state) => !state);
  }

  function handleProductiveExercisesChange(e) {
    // Toggle the state locally
    setProductiveExercises((state) => !state);

    // Update local storage
    const newProductiveValue = !productiveExercises;
    localStorage.setItem(
      "productiveExercisesEnabled",
      JSON.stringify(newProductiveValue),
    );
  }

  function handleSave(e) {
    e.preventDefault();

    SessionStorage.setAudioExercisesEnabled(audioExercises);
    api.saveUserPreferences({
      audio_exercises: audioExercises,
      productive_exercises: productiveExercises,
    });
    history.goBack();
  }

  return (
    <PreferencesPage layoutVariant={"minimalistic-top-aligned"}>
      <BackArrow />
      <Header withoutLogo>
        <Heading>{strings.exerciseTypePreferences}</Heading>
      </Header>
      <Main>
        <Form>
          <FormSection>
            <Checkbox
              id="audio-exercises-checkbox"
              label={
                <>
                  Include Audio Exercises{" "}
                  {SessionStorage.isAudioExercisesEnabled()
                    ? ""
                    : "(Temporaly Disabled)"}
                </>
              }
              checked={audioExercises}
              onChange={handleAudioExercisesChange}
            />
          </FormSection>
          {Feature.merle_exercises() && (
            <FormSection>
              <Checkbox
                id="productive-exercises-checkbox"
                label={<>Enable Productive Exercises</>}
                checked={productiveExercises}
                onChange={handleProductiveExercisesChange}
              />
            </FormSection>
          )}
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
