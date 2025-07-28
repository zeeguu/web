import React, { useState } from "react";
import { zeeguuOrange } from "./colors";
import { isMobileScreenWidth } from "./MainNav/screenSize";
import useScreenWidth from "../hooks/useScreenWidth";

export default function IOSInstallBanner({ browserType, onShowInstructions, onDismiss, show }) {
  const { screenWidth } = useScreenWidth();
  const isMobile = isMobileScreenWidth(screenWidth);
  const [useOrangeAccent, setUseOrangeAccent] = useState(true); // Default to orange for banner

  if (!show) return null;

  const accentColor = useOrangeAccent ? zeeguuOrange : "#007AFF";
  const accentHoverColor = useOrangeAccent ? "#e69500" : "#0056CC";

  // Get browser-specific text
  const getBrowserText = () => {
    switch (browserType) {
      case 'chrome':
        return 'Add Zeeguu to your home screen using Chrome\'s menu!';
      case 'safari':
        return 'Add Zeeguu to your home screen using Safari\'s share button!';
      case 'firefox':
        return 'Add Zeeguu to your home screen using Firefox\'s menu!';
      case 'edge':
        return 'Add Zeeguu to your home screen using Edge\'s menu!';
      default:
        return 'Add Zeeguu to your home screen for faster access!';
    }
  };

  const bannerStyle = {
    position: "fixed",
    top: "1rem",
    left: "1rem",
    right: "1rem",
    backgroundColor: "#fff",
    border: `2px solid ${accentColor}`,
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
    fontSize: "24px",
    fontWeight: "600",
    color: "#333",
    marginBottom: "6px",
  };

  const descriptionStyle = {
    margin: 0,
    fontSize: "21px",
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
    fontSize: "21px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.2s ease",
    minWidth: isMobile ? "120px" : "auto",
  };

  const installButtonStyle = {
    ...buttonStyle,
    backgroundColor: accentColor,
    color: "white",
  };

  const dismissButtonStyle = {
    ...buttonStyle,
    backgroundColor: "transparent",
    color: "#666",
    border: "1px solid #ddd",
  };

  const toggleLinkStyle = {
    fontSize: "11px",
    color: "#999",
    textDecoration: "underline",
    cursor: "pointer",
    marginTop: "8px",
    textAlign: "center",
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
            <h3 style={titleStyle}>Install Zeeguu App?</h3>
            <p style={descriptionStyle}>
              {getBrowserText()}
            </p>
          </div>
        </div>
        <div style={buttonContainerStyle}>
          <button
            style={installButtonStyle}
            onClick={onShowInstructions}
            onMouseOver={(e) => (e.target.style.backgroundColor = accentHoverColor)}
            onMouseOut={(e) => (e.target.style.backgroundColor = accentColor)}
          >
            Yes, now!
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
        
        <div style={toggleLinkStyle}>
          <a onClick={(e) => {
            e.preventDefault();
            setUseOrangeAccent(!useOrangeAccent);
          }}>
            Try {useOrangeAccent ? 'blue' : 'orange'} button
          </a>
        </div>
      </div>
    </>
  );
}
