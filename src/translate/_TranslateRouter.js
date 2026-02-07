import React from "react";
import { Switch } from "react-router-dom";
import { PrivateRoute } from "../PrivateRoute";
import * as s from "../components/ColumnWidth.sc";
import Translate from "./Translate";

export default function TranslateRouter() {
  return (
    <Switch>
      <s.NarrowColumn>
        <PrivateRoute exact path="/translate" component={Translate} />
      </s.NarrowColumn>
    </Switch>
  );
}
