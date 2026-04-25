// src/components/CenteredContainer.js
import React from "react";

const CenteredContainer = ({ children }) => (
  <div style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        width: "100%",
    }}>
    {children}
  </div>
);

export default CenteredContainer;