// https://stackoverflow.com/questions/52039083/handle-back-button-with-react-router
import { useHistory } from "react-router-dom";
import { zeeguuOrange } from "../components/colors";
import { OrangeBackButton } from "../components/allButtons.sc.js";

export const BackButton = () => {
  let history = useHistory();
  return (
    <>
      <OrangeBackButton
        onClick={() => history.goBack()}
      >
        🡰
      </OrangeBackButton>
    </>
  );
};
