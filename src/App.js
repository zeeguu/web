/*global chrome*/
import "./App.css";
import Popup from "./popup/Popup";
import { useState } from "react";
import { isLoggedIn } from "./popup/cookies";
import { WEB_URL } from "./config";

function App() {
  const [loggedIn, setLoggedIn] = useState();

  isLoggedIn(WEB_URL);
  chrome.storage.local.get("loggedIn", function (data) {
    if (data.loggedIn === undefined || data.loggedIn === false) {
      setLoggedIn(false);
    } else if (data.loggedIn === true) {
      setLoggedIn(true);
    }
  });

  if (loggedIn === undefined) {
    return <></>;
  }
  return <Popup loggedIn={loggedIn} setLoggedIn={setLoggedIn} />;
}

export default App;
