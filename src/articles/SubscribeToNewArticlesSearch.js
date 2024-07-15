import React, { useState } from "react";

export default function SubscribeToNewArticlesSearch() {
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [userDetails, setUserDetails] = useState(null);

  const handleEmailSubscription = () => {
    if (!isSubscribed) {
      setIsSubscribed(true);
    } else {
      setIsSubscribed(false);
    }
  };
  return (
    <button
      onClick={handleEmailSubscription}
      style={{ boxShadow: "none", all: "unset", marginTop: "0.4em" }}
    >
      {isSubscribed ? <MailIcon /> : <MailAddedIcon />}
    </button>
  );
}

// Icons for button

function MailIcon() {
  return (
    <svg
      focusable="false"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      style={{ width: "1.4em", height: "1.4em", fill: "orange" }}
    >
      <path d="M22 13H20V7.23792L12.0718 14.338L4 7.21594V19H14V21H3C2.44772 21 2 20.5523 2 20V4C2 3.44772 2.44772 3 3 3H21C21.5523 3 22 3.44772 22 4V13ZM4.51146 5L12.0619 11.662L19.501 5H4.51146ZM21 18H24V20H21V23H19V20H16V18H19V15H21V18Z"></path>
    </svg>
  );
}

function MailAddedIcon() {
  return (
    <svg
      focusable="false"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      style={{ width: "1.4em", height: "1.4em", fill: "orange" }}
    >
      <path d="M22 14H20V7.23792L12.0718 14.338L4 7.21594V19H14V21H3C2.44772 21 2 20.5523 2 20V4C2 3.44772 2.44772 3 3 3H21C21.5523 3 22 3.44772 22 4V14ZM4.51146 5L12.0619 11.662L19.501 5H4.51146ZM19 22L15.4645 18.4645L16.8787 17.0503L19 19.1716L22.5355 15.636L23.9497 17.0503L19 22Z"></path>
    </svg>
  );
}
