import { useState } from 'react';

const buttonStyles = {
  background: 'none',
  border: 'none',
  color: '#8b5f28',
  textDecoration: 'none',
  fontWeight: 400,
  backgroundColor: '#fff5e6',
  padding: '2px 6px',
  borderRadius: '3px',
  cursor: 'pointer',
  fontSize: 'inherit',
  margin: 0,
  outline: 'none',
  boxSizing: 'border-box',
  transition: 'all 0.2s ease',
  minHeight: '24px',
  display: 'inline-flex',
  alignItems: 'center'
};

export default function ActionButton({ children, onClick, as: Component = 'button', ...props }) {
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  const hoverStyles = isHovered ? {
    backgroundColor: '#f0e6cc',
    color: '#8b5f28'
  } : {};

  const combinedStyles = { ...buttonStyles, ...hoverStyles };

  return (
    <Component
      style={combinedStyles}
      onClick={onClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      {...props}
    >
      {children}
    </Component>
  );
}