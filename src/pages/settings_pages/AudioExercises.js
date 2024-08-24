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
        <Heading>{strings.audioExercises}</Heading>
      </Header>
      <Main>
        <Form>
          <FormSection>
            <label>Exercise Type Preferences</label>
            <div style={{ display: "flex" }} className="form-group">
              <input
                style={{ width: "1.5em" }}
                type={"checkbox"}
                checked={audioExercises}
                onChange={handleAudioExercisesChange}
              />
              <label>
                Include Audio Exercises{" "}
                {SessionStorage.isAudioExercisesEnabled()
                  ? ""
                  : "(Temporaly Disabled)"}
              </label>
            </div>
            {Feature.merle_exercises() && (
              <div style={{ display: "flex" }} className="form-group">
                <input
                  style={{ width: "1.5em" }}
                  type={"checkbox"}
                  checked={productiveExercises}
                  onChange={handleProductiveExercisesChange}
                />
                <label>Enable Productive Exercises</label>
              </div>
            )}
          </FormSection>
          <ButtonContainer>
            <Button onClick={handleSave}>{strings.save}</Button>
          </ButtonContainer>
        </Form>
      </Main>
    </InfoPage>
  );
}
