import React, { useContext } from "react";
import { APP_DOMAIN } from "./appConstants";
import { Route, Redirect } from "react-router-dom";
import { UserContext } from "./contexts/UserContext";

// inspired from:
// https://dev.to/mychal/protected-routes-with-react-function-components-dh

//PrivateRoute ensure that is a user isn't logged in
//- they cannot access the content of Zeeguu and will be redirected to the login-page

const PrivateRoute = ({ component: Component, ...rest }) => {
  const { session } = useContext(UserContext);

  const isAccountDelition = window.location.href.includes(
    APP_DOMAIN + "account_deletion",
  );
  if (!session) {
    if (isAccountDelition) {
      return (
        <Redirect
          to={{
            pathname: "/",
          }}
        />
      );
    } else {
      return (
        <Redirect
          to={{
            pathname: "/log_in",
            search: "?redirectLink=" + window.location.href,
          }}
        />
      );
    }
  }
  return (
    <Route {...rest} render={(props) => <Component {...rest} {...props} />} />
  );
};

export { PrivateRoute };
