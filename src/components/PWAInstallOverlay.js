import React from "react";
import { zeeguuOrange } from "./colors";
import { isMobileScreenWidth } from "./MainNav/screenSize";
import useScreenWidth from "../hooks/useScreenWidth";

export default function PWAInstallOverlay({ onClose, show, isIOSBrowser }) {
  const { screenWidth } = useScreenWidth();
  const isMobile = isMobileScreenWidth(screenWidth);

  if (!show) return null;

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
    padding: "32px",
    maxWidth: "500px",
    width: "100%",
    maxHeight: "90vh",
    overflowY: "auto",
    position: "relative",
    animation: "slideIn 0.3s ease-out",
  };

  const headerStyle = {
    textAlign: "center",
    marginBottom: "24px",
  };

  const iconStyle = {
    fontSize: "48px",
    marginBottom: "16px",
  };

  const titleStyle = {
    margin: 0,
    fontSize: "24px",
    fontWeight: "700",
    color: "#333",
    marginBottom: "8px",
  };

  const subtitleStyle = {
    margin: 0,
    fontSize: "16px",
    color: "#666",
    lineHeight: "1.4",
  };

  const instructionsStyle = {
    marginBottom: "24px",
  };

  const stepStyle = {
    display: "flex",
    alignItems: "flex-start",
    gap: "16px",
    marginBottom: "20px",
    padding: "16px",
    backgroundColor: "#f8f9fa",
    borderRadius: "12px",
    border: "1px solid #e9ecef",
  };

  const stepNumberStyle = {
    backgroundColor: zeeguuOrange,
    color: "white",
    borderRadius: "50%",
    width: "32px",
    height: "32px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "16px",
    fontWeight: "700",
    flexShrink: 0,
    marginTop: "2px",
  };

  const stepContentStyle = {
    flex: 1,
  };

  const stepTitleStyle = {
    margin: 0,
    fontSize: "16px",
    fontWeight: "600",
    color: "#333",
    marginBottom: "4px",
  };

  const stepDescriptionStyle = {
    margin: 0,
    fontSize: "14px",
    color: "#666",
    lineHeight: "1.4",
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
    backgroundColor: zeeguuOrange,
    color: "white",
    border: "none",
    borderRadius: "8px",
    fontSize: "16px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "background-color 0.2s ease",
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
            <h2 style={titleStyle}>Install Zeeguu App</h2>
            <p style={subtitleStyle}>
              Add Zeeguu to your home screen for faster access and a better reading experience!
            </p>
          </div>

          <div style={instructionsStyle}>
            {isIOSBrowser ? (
              <>
                <div style={stepStyle}>
                  <div style={stepNumberStyle}>1</div>
                  <div style={stepContentStyle}>
                    <h3 style={stepTitleStyle}>Tap the Share button</h3>
                    <p style={stepDescriptionStyle}>
                      Look for the share icon (square with arrow pointing up) in your address bar (at the top in Chrome, bottom in Safari)
                    </p>
                  </div>
                </div>
                <div style={stepStyle}>
                  <div style={stepNumberStyle}>2</div>
                  <div style={stepContentStyle}>
                    <h3 style={stepTitleStyle}>Find "Add to Home Screen"</h3>
                    <p style={stepDescriptionStyle}>
                      Scroll down in the share menu and tap "Add to Home Screen"
                    </p>
                  </div>
                </div>
                <div style={stepStyle}>
                  <div style={stepNumberStyle}>3</div>
                  <div style={stepContentStyle}>
                    <h3 style={stepTitleStyle}>Confirm installation</h3>
                    <p style={stepDescriptionStyle}>
                      Tap "Add" in the top right corner to install the Zeeguu app
                    </p>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div style={stepStyle}>
                  <div style={stepNumberStyle}>1</div>
                  <div style={stepContentStyle}>
                    <h3 style={stepTitleStyle}>Install prompt will appear</h3>
                    <p style={stepDescriptionStyle}>
                      Your browser will show an "Install" button or prompt
                    </p>
                  </div>
                </div>
                <div style={stepStyle}>
                  <div style={stepNumberStyle}>2</div>
                  <div style={stepContentStyle}>
                    <h3 style={stepTitleStyle}>Click Install</h3>
                    <p style={stepDescriptionStyle}>
                      Click the "Install" button to add Zeeguu to your home screen
                    </p>
                  </div>
                </div>
                <div style={stepStyle}>
                  <div style={stepNumberStyle}>3</div>
                  <div style={stepContentStyle}>
                    <h3 style={stepTitleStyle}>Enjoy the app!</h3>
                    <p style={stepDescriptionStyle}>
                      Access Zeeguu quickly from your home screen with offline reading support
                    </p>
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
        </div>
      </div>
    </>
  );
}