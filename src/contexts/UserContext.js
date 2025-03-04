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

// who uses what from userContext
// - learned_language: SideNavLanguageOption: learned_language
// - session
// - is_teacher: SideNav.js
// - native_language

// In LanguageModal we call setUser ...
export {
  UserContext, // Export it so it can be used by other Components
};

// https://www.digitalocean.com/community/tutorials/react-manage-user-login-react-context
