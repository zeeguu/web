/*global chrome*/
import "./App.css";
import Popup from "./popup/Popup";
import { useState } from "react";

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [loggedInOnZeeguu, setLoggedInOnZeeguu] = useState(false);

  chrome.cookies.get({ url: "https://www.zeeguu.org", name: "sessionID" },
    function (cookie) {
      if (cookie) {
        setLoggedInOnZeeguu(true);
        chrome.storage.local.set({ loggedIn: true }, () =>
          console.log("Cookie is present. Loggedin = ", true)
        );
        chrome.storage.local.set({ sessionId: cookie.value }, () =>
          console.log("sessionid is set in local storage", cookie.value)
        );
      } else {
        console.log("No cookie");
      }
    }
  );

  chrome.storage.local.get("loggedIn", function (data) {
    if (data.loggedIn === undefined || data.loggedIn === false) {
      setLoggedIn(false);
    } else if (data.loggedIn === true) {
      setLoggedIn(true);
    }
    console.log("is loggedin? ", loggedIn);
  });

  return (
    <Popup
      loggedIn={loggedIn}
      setLoggedIn={setLoggedIn}
      loggedInOnZeeguu={loggedInOnZeeguu}
      setLoggedInOnZeeguu={setLoggedInOnZeeguu}
    />
  );
}

export default App;
