import { Switch } from "react-router";
import { PrivateRoute } from "../../PrivateRoute";
import AllTexts from "../myTextsPage/AllTexts";
import AddTextOptions from "../myTextsPage/AddTextOptions";
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

      <PrivateRoute
        path="/teacher/texts/AddTextOptions"
        component={AddTextOptions}
      />
    </Switch>
  );
}
