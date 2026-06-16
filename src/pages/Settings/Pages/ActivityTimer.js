import { useHistory } from "react-router-dom";
import { useState, useEffect, useContext } from "react";
import { UserContext } from "../../../contexts/UserContext";
import Button from "../../_pages_shared/Button.sc";
import ButtonContainer from "../../_pages_shared/ButtonContainer.sc";
import Form from "../../_pages_shared/Form.sc";
import FormSection from "../../_pages_shared/FormSection.sc";
import CardPage from "../../_pages_shared/CardPage";
import Main from "../../_pages_shared/Main.sc";
import SettingsPageHeader from "../SharedComponents/SettingsPageHeader";
import Checkbox from "../../../components/modal_shared/Checkbox";
import strings from "../../../i18n/definitions";
import { setTitle } from "../../../assorted/setTitle";
import { APIContext } from "../../../contexts/APIContext";

export default function ActivityTimer() {
  const api = useContext(APIContext);
  const { userPreferences, setUserPreferences } = useContext(UserContext);
  const history = useHistory();

  const [showTimer, setShowTimer] = useState(false);

  useEffect(() => {
    setTitle("Activity Timer");
  }, []);

  useEffect(() => {
    setShowTimer(userPreferences?.["show_reading_timer"] === "true");
  }, [userPreferences]);

  function handleSave(e) {
    e.preventDefault();
    api.saveUserPreferences({ show_reading_timer: showTimer });
    // Keep UserContext in sync so consumers (e.g. ExerciseSession) see the change
    // without requiring a page reload.
    setUserPreferences({ ...userPreferences, show_reading_timer: showTimer.toString() });
    history.goBack();
  }

  return (
    <CardPage layoutVariant={"minimalistic-top-aligned"} isTransparent reducedPadding>
      <SettingsPageHeader title="Activity Timer" />
      <Main>
        <Form>
          <FormSection>
            <Checkbox
              id="show-timer-checkbox"
              label={<>Show activity timer in reader and exercises</>}
              checked={showTimer}
              onChange={() => setShowTimer((state) => !state)}
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
