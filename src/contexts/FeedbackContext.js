import React, { createContext, useState, useContext } from "react";

const FeedbackContext = createContext({
  contextualInfo: null,
  setContextualInfo: () => {},
});

export function FeedbackContextProvider({ children }) {
  const [contextualInfo, setContextualInfo] = useState(null);

  return (
    <FeedbackContext.Provider value={{ contextualInfo, setContextualInfo }}>
      {children}
    </FeedbackContext.Provider>
  );
}

export function useFeedbackContext() {
  return useContext(FeedbackContext);
}

export { FeedbackContext };