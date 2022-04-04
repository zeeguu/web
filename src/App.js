/*global chrome*/
import "./App.css";
import Popup from "./popup/Popup";
import { useState } from "react";
import { isLoggedIn } from "./popup/cookies";

function App() {
  const [loggedIn, setLoggedIn] = useState();

  isLoggedIn("https://zeeguu.org");
  isLoggedIn("https://www.zeeguu.org");

  chrome.storage.local.get("loggedIn", function (data) {
    if (data.loggedIn === undefined || data.loggedIn === false) {
      setLoggedIn(false);
    } else if (data.loggedIn === true) {
      setLoggedIn(true);
    }
  });

  return (
    <Popup
      loggedIn={loggedIn}
      setLoggedIn={setLoggedIn}
    />
  );
}

export default App;
