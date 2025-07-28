import React, { useState } from "react";
import { zeeguuOrange } from "./colors";
import { isMobileScreenWidth } from "./MainNav/screenSize";
import useScreenWidth from "../hooks/useScreenWidth";

export default function PWAInstallOverlay({ onClose, show, isIOSBrowser, iosBrowserType }) {
  const { screenWidth } = useScreenWidth();
  const isMobile = isMobileScreenWidth(screenWidth);
  const [useOrangeAccent, setUseOrangeAccent] = useState(false);

  if (!show) return null;

  // Real iOS share button icon
  const ShareButtonIcon = ({ style }) => (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{
        display: "inline-block",
        marginRight: "8px",
        verticalAlign: "middle",
        ...style,
      }}
    >
      <path d="M12 2L8 6h2.5v6h3V6H16l-4-4z" fill="#007AFF" />
      <path d="M6 14v6h12v-6h2v6a2 2 0 01-2 2H6a2 2 0 01-2-2v-6h2z" fill="#007AFF" />
    </svg>
  );

  // Get browser-specific instructions
  const getShareButtonText = () => {
    switch (iosBrowserType) {
      case "chrome":
        return (
          <>
            Look for the share icon <ShareButtonIcon /> in your address bar at the top
          </>
        );
      case "safari":
        return (
          <>
            Look for the share icon <ShareButtonIcon /> in your address bar at the bottom
          </>
        );
      default:
        return (
          <>
            Look for the share icon <ShareButtonIcon /> in your address bar
          </>
        );
    }
  };

  const overlayStyle = {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    zIndex: 10000,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "20px",
    animation: "fadeIn 0.3s ease-out",
  };

  const contentStyle = {
    backgroundColor: "#fff",
    borderRadius: "16px",
    padding: "24px",
    maxWidth: "400px",
    width: "100%",
    maxHeight: "85vh",
    overflowY: "auto",
    position: "relative",
    animation: "slideIn 0.3s ease-out",
  };

  const headerStyle = {
    textAlign: "center",
    marginBottom: "20px",
  };

  const iconStyle = {
    fontSize: "36px",
    marginBottom: "12px",
  };

  const titleStyle = {
    margin: 0,
    fontSize: "20px",
    fontWeight: "700",
    color: "#333",
    marginBottom: "6px",
  };

  const subtitleStyle = {
    margin: 0,
    fontSize: "14px",
    color: "#666",
    lineHeight: "1.3",
  };

  const instructionsStyle = {
    marginBottom: "20px",
  };

  const stepStyle = {
    display: "flex",
    alignItems: "flex-start",
    gap: "12px",
    marginBottom: "12px",
    padding: "12px",
    backgroundColor: "#f0f4ff",
    borderRadius: "8px",
    border: "1px solid #d6e3ff",
  };

  const buttonColor = useOrangeAccent ? zeeguuOrange : "#007AFF";
  const buttonHoverColor = useOrangeAccent ? "#e69500" : "#0056CC";

  const stepNumberStyle = {
    backgroundColor: "#007AFF", // Blue step numbers
    color: "white",
    borderRadius: "50%",
    width: "24px",
    height: "24px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "14px",
    fontWeight: "700",
    flexShrink: 0,
    marginTop: "1px",
  };

  const stepContentStyle = {
    flex: 1,
  };

  const stepTitleStyle = {
    margin: 0,
    fontSize: "14px",
    fontWeight: "600",
    color: "#333",
    lineHeight: "1.3",
  };

  const closeButtonStyle = {
    position: "absolute",
    top: "16px",
    right: "16px",
    background: "none",
    border: "none",
    fontSize: "24px",
    cursor: "pointer",
    color: "#999",
    padding: "8px",
    borderRadius: "50%",
    width: "40px",
    height: "40px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "background-color 0.2s ease",
  };

  const bottomButtonStyle = {
    width: "100%",
    padding: "12px 24px",
    backgroundColor: zeeguuOrange, // Orange "Got it!" button
    color: "white",
    border: "none",
    borderRadius: "8px",
    fontSize: "16px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "background-color 0.2s ease",
  };

  const toggleLinkStyle = {
    display: "block",
    textAlign: "center",
    marginTop: "12px",
    fontSize: "12px",
    color: "#666",
    textDecoration: "underline",
    cursor: "pointer",
  };

  return (
    <>
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          @keyframes slideIn {
            from { 
              transform: translateY(-20px);
              opacity: 0;
            }
            to { 
              transform: translateY(0);
              opacity: 1;
            }
          }
        `}
      </style>
      <div style={overlayStyle} onClick={onClose}>
        <div style={contentStyle} onClick={(e) => e.stopPropagation()}>
          <button
            style={closeButtonStyle}
            onClick={onClose}
            onMouseOver={(e) => (e.target.style.backgroundColor = "#f5f5f5")}
            onMouseOut={(e) => (e.target.style.backgroundColor = "transparent")}
            title="Close"
          >
            ×
          </button>

          <div style={headerStyle}>
            <div style={iconStyle}>📱</div>
            <h2 style={titleStyle}>Add Zeeguu to your home screen</h2>
          </div>

          <div style={instructionsStyle}>
            {isIOSBrowser ? (
              <>
                <div style={stepStyle}>
                  <div style={stepNumberStyle}>1</div>
                  <div style={stepContentStyle}>
                    <div style={stepTitleStyle}>{getShareButtonText()}</div>
                  </div>
                </div>
                <div style={stepStyle}>
                  <div style={stepNumberStyle}>2</div>
                  <div style={stepContentStyle}>
                    <div style={stepTitleStyle}>Scroll down and tap "Add to Home Screen"</div>
                  </div>
                </div>
                <div style={stepStyle}>
                  <div style={stepNumberStyle}>3</div>
                  <div style={stepContentStyle}>
                    <div style={stepTitleStyle}>Tap "Add" to install</div>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div style={stepStyle}>
                  <div style={stepNumberStyle}>1</div>
                  <div style={stepContentStyle}>
                    <div style={stepTitleStyle}>Tap the menu (⋮) in top right corner</div>
                  </div>
                </div>
                <div style={stepStyle}>
                  <div style={stepNumberStyle}>2</div>
                  <div style={stepContentStyle}>
                    <div style={stepTitleStyle}>Tap "Add to Home screen" or "Install app"</div>
                  </div>
                </div>
                <div style={stepStyle}>
                  <div style={stepNumberStyle}>3</div>
                  <div style={stepContentStyle}>
                    <div style={stepTitleStyle}>Tap "Add" or "Install"</div>
                  </div>
                </div>
              </>
            )}
          </div>

          <button
            style={bottomButtonStyle}
            onClick={onClose}
            onMouseOver={(e) => (e.target.style.backgroundColor = "#e69500")}
            onMouseOut={(e) => (e.target.style.backgroundColor = zeeguuOrange)}
          >
            Got it!
          </button>

          <a
            style={toggleLinkStyle}
            onClick={(e) => {
              e.preventDefault();
              setUseOrangeAccent(!useOrangeAccent);
            }}
          >
            Try {useOrangeAccent ? "blue" : "orange"} button
          </a>
        </div>
      </div>
    </>
  );
}
