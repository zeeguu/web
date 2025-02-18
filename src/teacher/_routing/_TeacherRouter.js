import { PrivateRoute } from "../../PrivateRoute";
import CohortsRouter from "./_CohortsRouter";
import Tutorials from "../helpPage/Tutorials";
import TeacherTextsRouter from "./_TeacherTextsRouter";

export default function TeacherRouter({ api }) {
  return (
    <>
      <PrivateRoute path="/teacher/classes" component={CohortsRouter} />
      <PrivateRoute path="/teacher/texts/" component={TeacherTextsRouter} />
      <PrivateRoute path="/teacher/tutorials" component={Tutorials} />
    </>
  );
}
