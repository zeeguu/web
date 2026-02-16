import React, { useContext } from "react";
import { APP_DOMAIN } from "./appConstants";
import { Route, Redirect } from "react-router-dom";
import { UserContext } from "./contexts/UserContext";

// inspired from:
// https://dev.to/mychal/protected-routes-with-react-function-components-dh

//PrivateRoute ensure that is a user isn't logged in
//- they cannot access the content of Zeeguu and will be redirected to the login-page

const PrivateRoute = ({ component: Component, ...rest }) => {
  const { session, userDetails } = useContext(UserContext);

  const isAccountDelition = window.location.href.includes(
    APP_DOMAIN + "account_deletion",
  );
  const isVerifyEmailPage = window.location.href.includes(
    APP_DOMAIN + "verify_email",
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

  // Check email verification - redirect to verify page if not verified
  // Uses backend-computed field that considers grandfathering for existing users
  if (
    userDetails &&
    userDetails.requires_email_verification &&
    !isVerifyEmailPage
  ) {
    return (
      <Redirect
        to={{
          pathname: "/verify_email",
        }}
      />
    );
  }

  return <Route {...rest} render={() => <Component />} />;
};

export { PrivateRoute };
