/*global chrome*/

import { useState } from "react";
import Zeeguu_API from "./api/Zeeguu_API"
export default function Login({ setLoggedIn }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function handleSignIn(e) {
    e.preventDefault();
    let api = new Zeeguu_API("https://api.zeeguu.org");
    api.signIn(email, password, () => {
      console.log("Wrong credentials")
    }, ()=>{
      chrome.storage.local.set({ loggedIn: true });
      setLoggedIn(true);
      console.log("Hurray")});
  }

  /****  This is what Zeeguu does with sessionID  ****/

     // let userDict = {};
     // // we use the _api to initialize the api state variable
     // let _api = new Zeeguu_API(process.env.REACT_APP_API_URL);
     // if (LocalStorage.hasSession()) {
     //   userDict = {
     //     session: localStorage["sessionID"],
     //     ...LocalStorage.userInfo(),
     //   };
     //   _api.session = localStorage["sessionID"];
     // }
     // useUILanguage();
     // const [api] = useState(_api);
     // const [user, setUser] = useState(userDict);     


      // function handleSuccessfulSignIn(userInfo, history) {
      //   setUser({
      //     session: api.session,
      //     name: userInfo.name,
      //     learned_language: userInfo.learned_language,
      //     native_language: userInfo.native_language,
      //     is_teacher: userInfo.is_teacher,
      //   });
      //   LocalStorage.setSession(api.session);
      //   LocalStorage.setUserInfo(userInfo);
      //   // TODO: this is required by the teacher dashboard
      //   // could be cool to remove it from there and make that
      //   // one also use the localStorage
      //   document.cookie = `sessionID=${api.session};`;
      //   userInfo.is_teacher
      //     ? history.push("/teacher/classes")
      //     : history.push("/articles");
      // }

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
