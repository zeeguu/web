import { useContext } from "react";
import { useLocation } from "react-router-dom/cjs/react-router-dom";
import { UserContext } from "../../../contexts/UserContext";
import SidebarOptionsForStudent from "./SidebarOptionsForStudent";
import SidebarOptionsForTeacher from "./SidebarOptionsForTeacher";
import * as s from "./Sidebar.sc";
import NavOption from "../NavOption";
import FeedbackButton from "../../FeedbackButton";
import NavigationOptions from "../navigationOptions";
import { MainNavContext } from "../../../contexts/MainNavContext";

export default function Sidebar({ screenWidth }) {
  const { is_teacher: isTeacher } = useContext(UserContext);
  const { mainNav } = useContext(MainNavContext);
  const { isOnStudentSide } = mainNav;

  const path = useLocation().pathname;
  const defaultPage = isTeacher ? "/teacher/classes" : "articles";

  return (
    <s.SideBar $screenWidth={screenWidth} role="navigation">
      <NavOption
        className={"logo"}
        linkTo={defaultPage}
        icon={<img src="../static/images/zeeguuWhiteLogo.svg"></img>}
        text={"Zeeguu"}
      ></NavOption>

      {isOnStudentSide && (
        <SidebarOptionsForStudent screenWidth={screenWidth} />
      )}

      {!isOnStudentSide && (
        <SidebarOptionsForTeacher screenWidth={screenWidth} />
      )}

      <s.BottomSection $screenWidth={screenWidth}>
        <NavOption
          {...NavigationOptions.settings}
          currentPath={path}
          screenWidth={screenWidth}
        />
        <FeedbackButton screenWidth={screenWidth} />
      </s.BottomSection>
    </s.SideBar>
  );
}
