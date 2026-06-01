import { useContext } from "react";
import { PrivateRoute } from "../../PrivateRoute";
import CohortsRouter from "./_CohortsRouter";
import Tutorials from "../helpPage/Tutorials";
import TeacherTextsRouter from "./_TeacherTextsRouter";
import TeacherPageTracker from "../../components/TeacherPageTracker";
import NotATeacherNotice from "../sharedComponents/NotATeacherNotice";
import { PageTitle } from "../../components/PageTitle";
import * as s from "../../components/ColumnWidth.sc";
import strings from "../../i18n/definitions";
import { UserContext } from "../../contexts/UserContext";

export default function TeacherRouter() {
  const { userDetails } = useContext(UserContext);

  // The /teacher routes are reachable by any logged-in user (PrivateRoute only
  // checks the session, not teacher status), e.g. via a saved bookmark while
  // signed in with a student account. Gate the whole teacher site here so every
  // sub-route — including bare /teacher, which matches no route below and would
  // otherwise render a blank panel — shows a clear explanation instead.
  if (userDetails && !userDetails.is_teacher) {
    return (
      <>
        <PageTitle>{strings.myClasses}</PageTitle>
        <s.NarrowColumn>
          <NotATeacherNotice />
        </s.NarrowColumn>
      </>
    );
  }

  return (
    <>
      <TeacherPageTracker />
      <PrivateRoute path="/teacher/classes" component={CohortsRouter} />
      <PrivateRoute path="/teacher/texts/" component={TeacherTextsRouter} />
      <PrivateRoute path="/teacher/tutorials" component={Tutorials} />
    </>
  );
}
