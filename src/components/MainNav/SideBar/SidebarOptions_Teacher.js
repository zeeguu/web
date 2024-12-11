import NavOption from "../NavOption";
import { useLocation } from "react-router-dom/cjs/react-router-dom";
import NavigationOptions from "../navigationOptions";

export default function SidebarOptions_Teacher({ screenWidth }) {
  const path = useLocation().pathname;
  return (
    <>
      <NavOption
        {...NavigationOptions.myClasses}
        currentPath={path}
        screenWidth={screenWidth}
      />
      <NavOption
        {...NavigationOptions.myTexts}
        currentPath={path}
        screenWidth={screenWidth}
      />
      <NavOption
        {...NavigationOptions.studentSite}
        currentPath={path}
        screenWidth={screenWidth}
      />
    </>
  );
}
