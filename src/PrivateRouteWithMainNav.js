import React, { useContext } from "react";
import { Route, Redirect } from "react-router-dom";
import { UserContext } from "./contexts/UserContext";
import AppWithMainNav from "./AppWithMainNav";

// inspired from:
// https://dev.to/mychal/protected-routes-with-react-function-components-dh

//PrivateRoute ensure that is a user isn't logged in
//- they cannot access the content of Zeeguu and will be redirected to the login-page

export const PrivateRouteWithMainNav = ({ component: Component, ...rest }) => {
  const user = useContext(UserContext);

  if (!user.session) {
    return (
      <Redirect
        to={{
          pathname: "/log_in",
          search: "?redirectLink=" + window.location.href,
        }}
      />
    );
  }
  return (
    <Route
      {...rest}
      render={() => <AppWithMainNav>{<Component {...rest} />}</AppWithMainNav>}
    />
  );
};
