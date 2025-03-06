import { useContext } from "react";
import { useLocation } from "react-router-dom/cjs/react-router-dom";
import { UserContext } from "../../../contexts/UserContext";
import { MainNavContext } from "../../../contexts/MainNavContext";
import SideNavOptionsForStudent from "./SideNavOptionsForStudent";
import SideNavOptionsForTeacher from "./SideNavOptionsForTeacher";
import NavOption from "../NavOption";
import FeedbackButton from "../../FeedbackButton";
import NavigationOptions from "../navigationOptions";
import SideNavLanguageOption from "./SideNavLanguageOption";
import * as s from "./SideNav.sc";

export default function SideNav({ screenWidth }) {
  const { userDetails } = useContext(UserContext);
  const { mainNavProperties } = useContext(MainNavContext);
  const { isOnStudentSide } = mainNavProperties;

  const path = useLocation().pathname;
  const defaultPage = userDetails.is_teacher ? "/teacher/classes" : "/articles";

  return (
    <s.SideNav $screenWidth={screenWidth} role="navigation">
      <s.NavList>
        <NavOption
          className={"logo"}
          linkTo={defaultPage}
          icon={<img alt="" src="../static/images/zeeguuWhiteLogo.svg"></img>}
          text={"Zeeguu"}
        ></NavOption>

        {isOnStudentSide && (
          <SideNavOptionsForStudent screenWidth={screenWidth} />
        )}

        {!isOnStudentSide && (
          <SideNavOptionsForTeacher screenWidth={screenWidth} />
        )}
      </s.NavList>

      <s.BottomSection $screenWidth={screenWidth}>
        <s.NavList>
          {isOnStudentSide && !path?.includes("/read") && (
            <SideNavLanguageOption screenWidth={screenWidth} />
          )}
          <NavOption
            {...NavigationOptions.settings}
            currentPath={path}
            screenWidth={screenWidth}
          />
          <FeedbackButton screenWidth={screenWidth} />
        </s.NavList>
      </s.BottomSection>
    </s.SideNav>
  );
}
