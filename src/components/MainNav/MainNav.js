import { useState, useContext, useEffect } from "react";
import { useLocation } from "react-router-dom/cjs/react-router-dom";
import { UserContext } from "../../contexts/UserContext";
import Sidebar from "./SideBar/Sidebar";
import BottomNav from "./BottomNav/BottomNav";
import { MOBILE_WIDTH } from "./screenSize";

export default function MainNav({ screenWidth }) {
  const { is_teacher: isTeacher } = useContext(UserContext);
  const [isOnStudentSide, setIsOnStudentSide] = useState(true);
  console.log(screenWidth);

  const path = useLocation().pathname;

  useEffect(() => {
    setIsOnStudentSide(!path.includes("teacher"));
  }, [path]);

  return (
    <>
      {screenWidth <= MOBILE_WIDTH ? (
        <BottomNav
          screenWidth={screenWidth}
          isOnStudentSide={isOnStudentSide}
          isTeacher={isTeacher}
        />
      ) : (
        <Sidebar
          screenWidth={screenWidth}
          isOnStudentSide={isOnStudentSide}
          isTeacher={isTeacher}
        />
      )}
    </>
  );
}
