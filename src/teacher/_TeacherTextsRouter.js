import { Switch } from "react-router";
import { PrivateRoute } from "../PrivateRoute";
import AllTexts from "./AllTexts";
import AddTextOptions from "./AddTextOptions";
import EditText from "./EditText";
import StudentsTextView from "./StudentTextView";

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
        path="/teacher/texts/AddTextsOption"
        api={api}
        component={AddTextOptions}
      />
    </Switch>
  );
}
