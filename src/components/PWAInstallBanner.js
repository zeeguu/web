import React from "react";
import { zeeguuOrange } from "./colors";
import { isMobileScreenWidth } from "./MainNav/screenSize";
import useScreenWidth from "../hooks/useScreenWidth";

export default function PWAInstallBanner({ onInstall, onDismiss, show }) {
  const { screenWidth } = useScreenWidth();
  const isMobile = isMobileScreenWidth(screenWidth);

  if (!show) return null;

  const bannerStyle = {
    position: "fixed",
    top: "1rem",
    left: "1rem",
    right: "1rem",
    backgroundColor: "#fff",
    border: `2px solid #007AFF`,
    borderRadius: "12px",
    padding: "20px",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
    zIndex: 1000,
    animation: "slideUp 0.3s ease-out",
    maxWidth: "500px",
    margin: "0 auto",
  };

  const containerStyle = {
    display: "flex",
    alignItems: "center",
    gap: "16px",
    marginBottom: "20px",
  };

  const iconStyle = {
    fontSize: "36px",
    flexShrink: 0,
  };

  const contentStyle = {
    flex: 1,
    minWidth: 0,
  };

  const titleStyle = {
    margin: 0,
    fontSize: "19px",
    fontWeight: "600",
    color: "#333",
    marginBottom: "6px",
  };

  const descriptionStyle = {
    margin: 0,
    fontSize: "17px",
    color: "#666",
    lineHeight: "1.4",
  };

  const buttonContainerStyle = {
    display: "flex",
    gap: "12px",
    flexDirection: isMobile ? "column" : "row",
  };

  const buttonStyle = {
    padding: "12px 24px",
    border: "none",
    borderRadius: "8px",
    fontSize: "17px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.2s ease",
    minWidth: isMobile ? "120px" : "auto",
  };

  const installButtonStyle = {
    ...buttonStyle,
    backgroundColor: zeeguuOrange,
    color: "white",
  };

  const dismissButtonStyle = {
    ...buttonStyle,
    backgroundColor: "transparent",
    color: "#666",
    border: "1px solid #ddd",
  };


  return (
    <>
      <style>
        {`
          @keyframes slideUp {
            from {
              transform: translateY(100%);
              opacity: 0;
            }
            to {
              transform: translateY(0);
              opacity: 1;
            }
          }
        `}
      </style>
      <div style={bannerStyle}>
        <div style={containerStyle}>
          <div style={iconStyle}>📱</div>
          <div style={contentStyle}>
            <h3 style={titleStyle}>Install Zeeguu as an app?</h3>
          </div>
        </div>
        <div style={buttonContainerStyle}>
          <button
            style={installButtonStyle}
            onClick={onInstall}
            onMouseOver={(e) => (e.target.style.backgroundColor = "#e69500")}
            onMouseOut={(e) => (e.target.style.backgroundColor = zeeguuOrange)}
          >
Yes, let's do it!
          </button>
          <button
            style={dismissButtonStyle}
            onClick={onDismiss}
            onMouseOver={(e) => (e.target.style.backgroundColor = "#f5f5f5")}
            onMouseOut={(e) => (e.target.style.backgroundColor = "transparent")}
          >
            Later
          </button>
        </div>
      </div>
    </>
  );
}
