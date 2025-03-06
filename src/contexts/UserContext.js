import React from "react";

const UserContext = React.createContext({
  // What we have in a user context:
  // - userDetails: {}
  // - setUserDetails
  // - userPreferences: {}
  // - setUserPreferences
  // - session
  // - logoutMethod
});


export {
  UserContext, // Export it so it can be used by other Components
};
