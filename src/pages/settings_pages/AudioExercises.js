import { useHistory } from "react-router-dom";
import { useState, useEffect, useContext } from "react";
import { UserContext } from "../../contexts/UserContext";
import SessionStorage from "../../assorted/SessionStorage";
import LocalStorage from "../../assorted/LocalStorage";
import Feature from "../../features/Feature";
import Button from "../info_page_shared/Button";
import ButtonContainer from "../info_page_shared/ButtonContainer";
import Form from "../info_page_shared/Form";
import FormSection from "../info_page_shared/FormSection";
import InfoPage from "../info_page_shared/InfoPage";
import Main from "../info_page_shared/Main";
import Header from "../info_page_shared/Header";
import Heading from "../info_page_shared/Heading";

import BackArrow from "./settings_pages_shared/BackArrow";
import Checkbox from "../../components/modal_shared/Checkbox";

import strings from "../../i18n/definitions";

export default function AudioExercises({ api }) {
  const user = useContext(UserContext);
  const history = useHistory();

  const [audioExercises, setAudioExercises] = useState(true);
  let preferenceNotSet =
    LocalStorage.getProductiveExercisesEnabled() === undefined;

  const [productiveExercises, setProductiveExercises] = useState(
    preferenceNotSet || LocalStorage.getProductiveExercisesEnabled(),
  );

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
    <InfoPage pageLocation={"settings"}>
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
          <ButtonContainer className={"padding-large"}>
            <Button className={"full-width-btn"} onClick={handleSave}>
              {strings.save}
            </Button>
          </ButtonContainer>
        </Form>
      </Main>
    </InfoPage>
  );
}
