import { Switch, useHistory } from "react-router-dom";
import { PrivateRoute } from "../PrivateRoute";
import ExerciseSession from "./ExerciseSession";
import Congratulations from "./Congratulations";
import * as s from "../components/ColumnWidth.sc";
import { WEB_READER } from "../reader/ArticleReader";
import { useContext } from "react";
import { APIContext } from "../contexts/APIContext";
import { UserContext } from "../contexts/UserContext";
import useDailyExercisesOnboarding from "../hooks/useDailyExercisesOnboarding";
import DailyExercisesOnboardingPopup from "../pages/onboarding/notifications/DailyExercisesOnboardingPopup";
import useOnboardingModal from "../hooks/useOnboardingModal";
import { ONBOARDING_MESSAGE_IDS } from "../appConstants";
import LearningLevelsOnboardingPopup from "../pages/onboarding/notifications/LearningLevelsOnboardingPopup";

export default function ExercisesRouter() {
  const api = useContext(APIContext);
  const { userDetails } = useContext(UserContext);
  const history = useHistory();

  const dailyExercisesModal = useDailyExercisesOnboarding(api, userDetails);
  // #1108 — programmatic trigger, no wrapper needed
  const learningLevelsModal = useOnboardingModal(api, ONBOARDING_MESSAGE_IDS.learningLevels);

  const backToReadingAction = () => {
    history.push("/articles");
    api.logUserActivity(api.BACK_TO_READING, "", "", WEB_READER);
  };

  const keepExercisingAction = () => {
    history.push("/exercises");
    api.logUserActivity(api.KEEP_EXERCISING, "", "", WEB_READER);
  };

  const toScheduledExercises = () => {
    history.push("/exercises");
    api.logUserActivity(api.TO_SCHEDULED_EXERCISES, "", "", WEB_READER);
  };

  return (
    <>
      <Switch>
        <PrivateRoute
          path="/exercises/summary"
          component={Congratulations}
          backButtonAction={backToReadingAction}
          keepExercisingAction={keepExercisingAction}
          toScheduledExercises={toScheduledExercises}
        />
        <s.NarrowColumn>
          <PrivateRoute
            path="/exercises/no-words"
            component={ExerciseSession}
            backButtonAction={backToReadingAction}
            keepExercisingAction={keepExercisingAction}
            toScheduledExercises={toScheduledExercises}
            source={WEB_READER}
          />
          <PrivateRoute
            path="/exercises"
            component={ExerciseSession}
            backButtonAction={backToReadingAction}
            keepExercisingAction={keepExercisingAction}
            toScheduledExercises={toScheduledExercises}
            source={WEB_READER}
          />
        </s.NarrowColumn>
      </Switch>
      <DailyExercisesOnboardingPopup
        open={dailyExercisesModal.open}
        handleCancel={dailyExercisesModal.close}
        onContinue={learningLevelsModal.show}
      />
      <LearningLevelsOnboardingPopup open={learningLevelsModal.open} handleCancel={learningLevelsModal.close} />
    </>
  );
}
