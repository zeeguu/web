/*global chrome*/

import { useState } from "react";
export default function Login({ setLoggedIn }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function handleSignIn(e) {
    e.preventDefault();
    chrome.storage.local.set({ loggedIn: true });
    setLoggedIn(true);
    //api.signIn(email, password, setErrorMessage, (sessionId) => {
    //  api.getUserDetails((userInfo) => {
    //    signInAndRedirect(userInfo, history);
    // });
    //});
  }

  return (
    <form action="" method="post">
      <div class="container">
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
        <button
          type="submit"
          onClick={handleSignIn}
          name="login"
          value="Login"
          className="loginButton"
        >
          Login
        </button>
      </div>
    </form>
  );
}
