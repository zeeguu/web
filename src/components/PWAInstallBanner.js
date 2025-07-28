import React from 'react';
import { zeeguuOrange } from './colors';
import { isMobileScreenWidth } from './MainNav/screenSize';
import useScreenWidth from '../hooks/useScreenWidth';

export default function PWAInstallBanner({ onInstall, onDismiss, show }) {
  const { screenWidth } = useScreenWidth();
  const isMobile = isMobileScreenWidth(screenWidth);

  if (!show) return null;

  const bannerStyle = {
    position: 'fixed',
    bottom: isMobile ? '4rem' : '1rem', // Above mobile nav if present
    left: '1rem',
    right: '1rem',
    backgroundColor: '#fff',
    border: `2px solid ${zeeguuOrange}`,
    borderRadius: '12px',
    padding: '16px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
    zIndex: 1000,
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    animation: 'slideUp 0.3s ease-out',
    maxWidth: '500px',
    margin: '0 auto',
  };

  const iconStyle = {
    fontSize: '24px',
    flexShrink: 0,
  };

  const contentStyle = {
    flex: 1,
    minWidth: 0, // Allow text to shrink
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
  };

  const buttonContainerStyle = {
    display: 'flex',
    gap: '8px',
    flexDirection: isMobile ? 'column' : 'row',
    flexShrink: 0,
  };

  const buttonStyle = {
    padding: '8px 16px',
    border: 'none',
    borderRadius: '6px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    minWidth: isMobile ? '80px' : 'auto',
  };

  const installButtonStyle = {
    ...buttonStyle,
    backgroundColor: zeeguuOrange,
    color: 'white',
  };

  const dismissButtonStyle = {
    ...buttonStyle,
    backgroundColor: 'transparent',
    color: '#666',
    border: '1px solid #ddd',
  };

  const handleInstall = () => {
    onInstall();
  };

  const handleDismiss = () => {
    onDismiss();
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
        <div style={iconStyle}>📱</div>
        <div style={contentStyle}>
          <h3 style={titleStyle}>Install Zeeguu App</h3>
          <p style={descriptionStyle}>
            Get the full experience with offline reading, faster loading, and quick access from your home screen!
          </p>
        </div>
        <div style={buttonContainerStyle}>
          <button 
            style={installButtonStyle}
            onClick={handleInstall}
            onMouseOver={(e) => e.target.style.backgroundColor = '#e69500'}
            onMouseOut={(e) => e.target.style.backgroundColor = zeeguuOrange}
          >
            Install
          </button>
          <button 
            style={dismissButtonStyle}
            onClick={handleDismiss}
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