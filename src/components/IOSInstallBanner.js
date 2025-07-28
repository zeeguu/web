import React from 'react';
import { zeeguuOrange } from './colors';
import { isMobileScreenWidth } from './MainNav/screenSize';
import useScreenWidth from '../hooks/useScreenWidth';

export default function IOSInstallBanner({ onDismiss, show }) {
  const { screenWidth } = useScreenWidth();
  const isMobile = isMobileScreenWidth(screenWidth);

  if (!show) return null;

  const bannerStyle = {
    position: 'fixed',
    bottom: isMobile ? '4rem' : '1rem',
    left: '1rem',
    right: '1rem',
    backgroundColor: '#fff',
    border: `2px solid ${zeeguuOrange}`,
    borderRadius: '12px',
    padding: '16px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
    zIndex: 1000,
    animation: 'slideUp 0.3s ease-out',
    maxWidth: '500px',
    margin: '0 auto',
  };

  const headerStyle = {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '12px',
    marginBottom: '12px',
  };

  const iconStyle = {
    fontSize: '24px',
    flexShrink: 0,
    marginTop: '2px',
  };

  const contentStyle = {
    flex: 1,
    minWidth: 0,
  };

  const titleStyle = {
    margin: 0,
    fontSize: '16px',
    fontWeight: '600',
    color: '#333',
    marginBottom: '4px',
  };

  const descriptionStyle = {
    margin: 0,
    fontSize: '14px',
    color: '#666',
    lineHeight: '1.4',
    marginBottom: '12px',
  };

  const instructionsStyle = {
    backgroundColor: '#f8f9fa',
    borderRadius: '8px',
    padding: '12px',
    fontSize: '14px',
    lineHeight: '1.4',
    marginBottom: '12px',
  };

  const stepStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '6px',
  };

  const stepNumberStyle = {
    backgroundColor: zeeguuOrange,
    color: 'white',
    borderRadius: '50%',
    width: '20px',
    height: '20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '12px',
    fontWeight: '600',
    flexShrink: 0,
  };

  const buttonContainerStyle = {
    display: 'flex',
    justifyContent: 'flex-end',
  };

  const dismissButtonStyle = {
    padding: '8px 16px',
    border: '1px solid #ddd',
    borderRadius: '6px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    backgroundColor: 'transparent',
    color: '#666',
    transition: 'all 0.2s ease',
  };

  const closeStyle = {
    position: 'absolute',
    top: '12px',
    right: '12px',
    background: 'none',
    border: 'none',
    fontSize: '20px',
    cursor: 'pointer',
    color: '#999',
    padding: '4px',
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
        <button 
          style={closeStyle}
          onClick={onDismiss}
          title="Close"
        >
          ×
        </button>
        
        <div style={headerStyle}>
          <div style={iconStyle}>📱</div>
          <div style={contentStyle}>
            <h3 style={titleStyle}>Install Zeeguu App</h3>
            <p style={descriptionStyle}>
              Add Zeeguu to your home screen for a better experience!
            </p>
          </div>
        </div>

        <div style={instructionsStyle}>
          <div style={stepStyle}>
            <div style={stepNumberStyle}>1</div>
            <span>Tap the <strong>Share</strong> button at the bottom of Safari</span>
          </div>
          <div style={stepStyle}>
            <div style={stepNumberStyle}>2</div>
            <span>Scroll down and tap <strong>"Add to Home Screen"</strong></span>
          </div>
          <div style={stepStyle}>
            <div style={stepNumberStyle}>3</div>
            <span>Tap <strong>"Add"</strong> to install the app</span>
          </div>
        </div>

        <div style={buttonContainerStyle}>
          <button 
            style={dismissButtonStyle}
            onClick={onDismiss}
            onMouseOver={(e) => e.target.style.backgroundColor = '#f5f5f5'}
            onMouseOut={(e) => e.target.style.backgroundColor = 'transparent'}
          >
            Ask tomorrow
          </button>
        </div>
      </div>
    </>
  );
}