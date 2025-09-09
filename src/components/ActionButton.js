import { useState } from "react";

const getButtonStyles = (variant) => {
  const baseStyles = {
    background: "none",
    border: "none",
    textDecoration: "none",
    fontWeight: 400,
    padding: "2px 6px",
    borderRadius: "3px",
    cursor: "pointer",
    fontSize: "inherit",
    margin: 0,
    outline: "none",
    boxSizing: "border-box",
    transition: "all 0.2s ease",
    minHeight: "36px",
    display: "inline-flex",
    alignItems: "center",
  };

  const variants = {
    default: {
      color: "#8b5f28",
      backgroundColor: "#fff5e6",
    },
    muted: {
      color: "#999",
      backgroundColor: "#fafafa",
      border: "1px solid #f0f0f0",
    },
  };

  return { ...baseStyles, ...variants[variant] };
};

export default function ActionButton({ children, onClick, variant = "default", as: Component = "button", ...props }) {
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  const getHoverStyles = (variant) => {
    const hoverVariants = {
      default: {
        backgroundColor: "#f0e6cc",
        color: "#8b5f28",
      },
      muted: {
        backgroundColor: "#f0f0f0",
        color: "#666",
      },
    };
    return hoverVariants[variant];
  };

  const hoverStyles = isHovered ? getHoverStyles(variant) : {};
  const baseStyles = getButtonStyles(variant);
  const combinedStyles = { ...baseStyles, ...hoverStyles };

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
