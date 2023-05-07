import strings from "../i18n/definitions";

export default function TeacherSpecificSidebarOptions({ SidebarLink }) {
  return (
    <>
      <SidebarLink text={strings.myClasses} to="/teacher/classes" />

      <SidebarLink text={strings.myTexts} to="/teacher/texts" />

      <br />

      <SidebarLink text={strings.studentSite} to="/articles" />
    </>
  );
}
