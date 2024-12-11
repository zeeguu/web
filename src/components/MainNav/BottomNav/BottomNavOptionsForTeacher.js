import { useLocation } from "react-router-dom/cjs/react-router-dom";
import BottomNavOption from "./BottomNavOption";
import NavigationOptions from "../navigationOptions";

export default function BottomNavOptionsForTeacher() {
  const path = useLocation().pathname;
  return (
    <>
      <BottomNavOption {...NavigationOptions.myClasses} currentPath={path} />

      <BottomNavOption {...NavigationOptions.myTexts} currentPath={path} />
    </>
  );
}
