/*global chrome*/
import "./App.css";
import Popup from "./popup/Popup";
import { useState } from "react";

function App() {
  const [loggedIn, setLoggedIn] = useState();

  chrome.cookies.get({ url: "https://zeeguu.org", name: "sessionID" },
    function (cookie) {
      if (cookie) {
        chrome.storage.local.set({ loggedIn: true }, () =>
          console.log("Cookie is present. Loggedin = ", true, cookie.value)
        );
        chrome.storage.local.set({ sessionId: cookie.value }, () =>
          console.log("sessionid is set in local storage", cookie.value)
        );
      } else {
        chrome.storage.local.set({ loggedIn: false }, () => 
        console.log("No cookie. loggedIn set to false in local storage"))
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

  if (loggedIn === undefined) {
    //return loader? or white screen?
    return <p></p>
  }

  return (
    <Popup
      loggedIn={loggedIn}
      setLoggedIn={setLoggedIn}
    />
  );
}

export default App;
