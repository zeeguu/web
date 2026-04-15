import React from 'react';
import ReactDOM from 'react-dom';
import Popup from './popup/Popup';
import { getIsLoggedIn } from './popup/cookies';
import { WEB_URL } from '../../config';
import { PopUp } from './popup/Popup.styles';

function App() {
  const [loggedIn, setLoggedIn] = React.useState(null);

  React.useEffect(() => {
    getIsLoggedIn(WEB_URL)
      .then((ok) => setLoggedIn(!!ok))
      .catch(() => setLoggedIn(false));
  }, []);

  if (loggedIn === null) return <PopUp />;
  return <Popup loggedIn={loggedIn} />;
}

// Wait for DOM to be ready
console.log("Firefox popup index.js loaded, DOM state:", document.readyState);
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    console.log("Firefox popup DOM ready, rendering App");
    ReactDOM.render(<App />, document.getElementById('root'));
  });
} else {
  console.log("Firefox popup DOM already ready, rendering App");
  ReactDOM.render(<App />, document.getElementById('root'));
}