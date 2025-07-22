import React from 'react';
import ReactDOM from 'react-dom';
import Popup from './popup/Popup';
import { getIsLoggedIn } from './popup/cookies';
import { WEB_URL } from '../../config';
import { PopUp } from './popup/Popup.styles';
import { LoadingCircle } from './popup/PopupLoading.styles';

// Main App component that handles login state
function App() {
  console.log("Firefox popup App component loaded");
  const [loggedIn, setLoggedIn] = React.useState(null); // null = checking, true/false = determined
  
  React.useEffect(() => {
    // Check if user is logged in
    async function checkLogin() {
      try {
        const isLoggedIn = await getIsLoggedIn(WEB_URL);
        setLoggedIn(!!isLoggedIn); // Convert to boolean
      } catch (error) {
        console.error('Error checking login:', error);
        setLoggedIn(false); // Default to not logged in on error
      }
    }
    
    checkLogin();
  }, []);
  
  // Show loading state while checking login
  if (loggedIn === null) {
    return (
      <PopUp style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
        <LoadingCircle />
        <span style={{ fontSize: '12px', color: '#666' }}>Checking login...</span>
      </PopUp>
    );
  }
  
  // Render the actual popup
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