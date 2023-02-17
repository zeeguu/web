import strings from "../i18n/definitions";
import * as s from "./TeacherSpecificSidebarOptions.sc";

export default function TeacherSpecificSidebarOptions({
  SidebarLink,
  onClick,
}) {
  return (
    <s.TeacherSpecificSidebarOptionsContainer onClick={onClick}>
      <SidebarLink text={strings.myClasses} to="/teacher/classes" />

      <SidebarLink text={strings.myTexts} to="/teacher/texts" />

      <br />

      <SidebarLink text={strings.studentSite} to="/articles" />
    </s.TeacherSpecificSidebarOptionsContainer>
  );
}
