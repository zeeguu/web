import * as s from "./ContentWithSidebar.sc";
import { useLocation } from "react-router-dom/cjs/react-router-dom";
import { UserContext } from "../../contexts/UserContext";
import { isMobile } from "../../utils/misc/browserDetection";
import NewSidebar from "./NewSidebar";
import BottomNav from "./BottomNav";
import { useState, useContext, useEffect } from "react";

export default function ContentWithSidebar(props) {
  const { children: appContent } = props;
  const [isCollapsed, setIsCollapsed] = useState(false);

  const user = useContext(UserContext);
  const [isOnStudentSide, setIsOnStudentSide] = useState(true);
  const [isTeacher] = useState(user.is_teacher);

  const path = useLocation().pathname;
  const defaultPage = user.is_teacher ? "/teacher/classes" : "articles";

  useEffect(() => {
    setIsOnStudentSide(!path.includes("teacher"));
  }, [path]);

  return (
    <s.Content isMobile={isMobile()} id="scrollHolder" className="content">
      {isMobile() ? (
        <BottomNav isOnStudentSide={isOnStudentSide} isTeacher={isTeacher} />
      ) : (
        <NewSidebar
          isOnStudentSide={isOnStudentSide}
          isTeacher={isTeacher}
          isCollapsed={isCollapsed}
          setIsCollapsed={setIsCollapsed}
        />
      )}
      <s.ContentContainer isMobile={isMobile()} isCollapsed={isCollapsed}>
        {appContent}
      </s.ContentContainer>
    </s.Content>
  );
}
