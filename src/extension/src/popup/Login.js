/*global chrome*/
import { useState } from "react";
import { StyledSmallButtonBlue } from "../InjectedReaderApp/Buttons.styles";
import { MainContainer, BottomContainer } from "./Login.styles";
import { BROWSER_API } from "../utils/browserApi";

export default function Login({ setLoggedIn, handleSuccessfulSignIn, api }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  function handleSignIn(e) {
    e.preventDefault();
    api.signIn(email, password, setErrorMessage, (sessionId) => {
      BROWSER_API.storage.local.set({ loggedIn: true });
      api.getUserDetails((userInfo) => {
        handleSuccessfulSignIn(userInfo, sessionId);
      });
    });
  }

  return (
    <form action="" method="post">
      <MainContainer>
        <label for="email">
          <b>Email</b>
        </label>
        <input
          type="email"
          placeholder="Enter email"
          id="email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <label for="psw">
          <b>Password</b>
        </label>
        <input
          type="password"
          placeholder="Enter Password"
          name="psw"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {errorMessage && <div className="error">{errorMessage}</div>}
        <StyledSmallButtonBlue
          type="submit"
          onClick={handleSignIn}
          name="login"
          value="Login"
          className="loginButton"
        >
          Login
        </StyledSmallButtonBlue>
        <BottomContainer>
          <p>
            Alternatively, you can{" "}
            <a
              class="links"
              target="_blank"
              rel="noreferrer"
              href="https://zeeguu.org/create_account"
            >
              create an account
            </a>{" "}
            or{" "}
            <a
              class="links"
              target="_blank"
              href="https://zeeguu.org/reset_pass"
            >
              reset your password
            </a>
            .
          </p>
        </BottomContainer>
      </MainContainer>
    </form>
  );
}
