import React, { useContext } from "react";
import { Route, Redirect } from "react-router-dom";
import { UserContext } from "./contexts/UserContext";
import MainNavWithComponent from "./MainNavWithComponent";
import TopBar from "./components/TopNav/TopBar";


// inspired from:
// https://dev.to/mychal/protected-routes-with-react-function-components-dh

//PrivateRoute ensure that is a user isn't logged in
//- they cannot access the content of Zeeguu and will be redirected to the login-page

export const PrivateRouteWithMainNav = ({ component: Component, ...rest }) => {
  const { session } = useContext(UserContext);

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
  return (

    <Route
      {...rest}

      render={() => (
        <><TopBar /><MainNavWithComponent>{<Component {...rest} />}</MainNavWithComponent></>
      )}
    />
  );
};
