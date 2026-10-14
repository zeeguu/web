import { Redirect, Switch } from "react-router";
import { PrivateRoute } from "../../PrivateRoute";
import AllTexts from "../myTextsPage/AllTexts";
import EditText from "../myTextsPage/EditText";
import StudentsTextView from "../myTextsPage/StudentTextView";

export default function TeacherTextsRouter() {
  return (
    <Switch>
      <PrivateRoute path="/teacher/texts" exact component={AllTexts} />
      <PrivateRoute
        path="/teacher/texts/editText/:articleID"
        exact
        component={EditText}
      />
      <PrivateRoute
        path="/teacher/texts/editText/:articleID/studentView"
        component={StudentsTextView}
      />

      {/* Add Text used to land on a page of three options; it now opens the
          editor directly. Kept for bookmarks to the old page. */}
      <Redirect from="/teacher/texts/AddTextOptions" to="/teacher/texts/editText/new" />
    </Switch>
  );
}
