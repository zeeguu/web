import React, { useContext } from "react";
import { Route, Redirect, useLocation } from "react-router-dom";
import { UserContext } from "./contexts/UserContext";

// inspired from:
// https://dev.to/mychal/protected-routes-with-react-function-components-dh

//PrivateRoute ensure that is a user isn't logged in
//- they cannot access the content of Zeeguu and will be redirected to the login-page

const PrivateRoute = ({ component: Component, ...rest }) => {
  const { session, userDetails } = useContext(UserContext);
  const { pathname } = useLocation();

  // Separate Route-specific props from component props
  const { path, exact, strict, sensitive, ...componentProps } = rest;

  // Ask the router where we are, rather than string-matching window.location
  // against APP_DOMAIN. APP_DOMAIN is window.location.origin, which has no
  // trailing slash, so `APP_DOMAIN + "verify_email"` built
  // "https://www.zeeguu.orgverify_email" and never matched anything: both flags
  // were permanently false. That mattered for the email check below, which then
  // fired even at /verify_email and returned a Redirect instead of the Route —
  // so VerifyEmail could never render and an unverified user had nowhere to
  // enter their code. Nobody hit it while the startup error modal was keeping
  // those users out of the router entirely.
  const isAccountDeletion = pathname.startsWith("/account_deletion");
  const isVerifyEmailPage = pathname.startsWith("/verify_email");

  if (!session) {
    if (isAccountDeletion) {
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
            search: "?redirectLink=" + encodeURIComponent(window.location.href),
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

  return <Route {...rest} render={(routeProps) => <Component {...routeProps} {...componentProps} />} />;
};

export { PrivateRoute };
