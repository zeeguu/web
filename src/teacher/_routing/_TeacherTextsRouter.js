import { Switch } from "react-router";
import { PrivateRoute } from "../../PrivateRoute";
import AllTexts from "../myTextsPage/AllTexts";
import AddTextOptions from "../myTextsPage/AddTextOptions";
import EditText from "../myTextsPage/EditText";
import StudentsTextView from "../myTextsPage/StudentTextView";

export default function TeacherTextsRouter({ api }) {
  return (
    <Switch>
      <PrivateRoute
        path="/teacher/texts"
        exact
        api={api}
        component={AllTexts}
      />
      <PrivateRoute
        path="/teacher/texts/editText/:articleID"
        exact
        api={api}
        component={EditText}
      />
      <PrivateRoute
        path="/teacher/texts/editText/:articleID/studentView"
        api={api}
        component={StudentsTextView}
      />

      <PrivateRoute
        path="/teacher/texts/AddTextOptions"
        api={api}
        component={AddTextOptions}
      />
    </Switch>
  );
}
