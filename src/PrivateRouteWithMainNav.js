import React, { useContext } from "react";
import { Route, Redirect } from "react-router-dom";
import { UserContext } from "./contexts/UserContext";
import MainNavWithComponent from "./MainNavWithComponent";
import { APP_DOMAIN } from "./appConstants";

// inspired from:
// https://dev.to/mychal/protected-routes-with-react-function-components-dh

//PrivateRoute ensure that is a user isn't logged in
//- they cannot access the content of Zeeguu and will be redirected to the login-page

export const PrivateRouteWithMainNav = ({ component: Component, ...rest }) => {
  const { session, userDetails } = useContext(UserContext);

  if (!session) {
    return (
      <Redirect
        to={{
          pathname: "/log_in",
          search: "?redirectLink=" + window.location.href,
        }}
      />
    );
  }

  // Check email verification - redirect to verify page if not verified
  // Uses backend-computed field that considers grandfathering for existing users
  if (userDetails && userDetails.requires_email_verification) {
    return (
      <Redirect
        to={{
          pathname: "/verify_email",
        }}
      />
    );
  }

  return (
    <Route
      {...rest}
      render={() => (
        <MainNavWithComponent>
          <Component />
        </MainNavWithComponent>
      )}
    />
  );
};
