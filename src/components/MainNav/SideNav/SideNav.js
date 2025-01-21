import { useContext } from "react";
import { useLocation } from "react-router-dom/cjs/react-router-dom";
import { UserContext } from "../../../contexts/UserContext";
import SideNavOptionsForStudent from "./SideNavOptionsForStudent";
import SideNavOptionsForTeacher from "./SideNavOptionsForTeacher";
import * as s from "./SideNav.sc";
import NavOption from "../NavOption";
import FeedbackButton from "../../FeedbackButton";
import NavigationOptions from "../navigationOptions";
import { MainNavContext } from "../../../contexts/MainNavContext";

export default function SideNav({ screenWidth }) {
  const { is_teacher: isTeacher } = useContext(UserContext);
  const { mainNav } = useContext(MainNavContext);
  const { isOnStudentSide } = mainNav;

  const path = useLocation().pathname;
  const defaultPage = isTeacher ? "/teacher/classes" : "articles";

  return (
    <s.SideNav $screenWidth={screenWidth} role="navigation">
      <NavOption
        className={"logo"}
        linkTo={defaultPage}
        icon={
          <img
            alt="Zeeguu logo - the elephant"
            src="../static/images/zeeguuWhiteLogo.svg"
          ></img>
        }
        text={"Zeeguu"}
      ></NavOption>

      {isOnStudentSide && (
        <SideNavOptionsForStudent screenWidth={screenWidth} />
      )}

      {!isOnStudentSide && (
        <SideNavOptionsForTeacher screenWidth={screenWidth} />
      )}

      <s.BottomSection $screenWidth={screenWidth}>
        <NavOption
          {...NavigationOptions.settings}
          currentPath={path}
          screenWidth={screenWidth}
        />
        <FeedbackButton screenWidth={screenWidth} />
      </s.BottomSection>
    </s.SideNav>
  );
}
