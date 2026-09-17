import { render, screen } from "@testing-library/react";
import { MemoryRouter, Switch } from "react-router-dom";
import { PrivateRoute } from "../../src/PrivateRoute";
import { UserContext } from "../../src/contexts/UserContext";

const VerifyPage = () => <div>verify page</div>;
const ArticlesPage = () => <div>articles page</div>;

function renderAt(pathname, userDetails) {
  render(
    <UserContext.Provider value={{ session: "a-session", userDetails }}>
      <MemoryRouter initialEntries={[pathname]}>
        <Switch>
          <PrivateRoute path="/verify_email" component={VerifyPage} />
          <PrivateRoute path="/articles" component={ArticlesPage} />
        </Switch>
      </MemoryRouter>
    </UserContext.Provider>,
  );
}

const unverified = { requires_email_verification: true };
const verified = { requires_email_verification: false };

describe("PrivateRoute and the email verification gate", () => {
  // The regression: the "am I already on the verify page?" check was built as
  // APP_DOMAIN + "verify_email" and matched against window.location.href.
  // APP_DOMAIN is window.location.origin, which has no trailing slash, so the
  // check was always false and PrivateRoute redirected to /verify_email even
  // when already there — returning a Redirect instead of the Route, so this
  // page could never render and unverified users had nowhere to type the code.
  test("renders the verify page when already on it", () => {
    renderAt("/verify_email", unverified);

    expect(screen.getByText("verify page")).toBeInTheDocument();
  });

  test("sends an unverified user there from anywhere else", () => {
    renderAt("/articles", unverified);

    expect(screen.getByText("verify page")).toBeInTheDocument();
    expect(screen.queryByText("articles page")).not.toBeInTheDocument();
  });

  test("leaves a verified user alone", () => {
    renderAt("/articles", verified);

    expect(screen.getByText("articles page")).toBeInTheDocument();
  });
});
