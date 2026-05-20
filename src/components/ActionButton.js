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
      color: "var(--action-btn-text)",
      backgroundColor: "var(--action-btn-bg)",
    },
    muted: {
      color: "var(--action-btn-muted-text)",
      backgroundColor: "var(--action-btn-muted-bg)",
      border: "1px solid var(--action-btn-muted-border)",
    },
    // For in-app links (article opens that route to the Zeeguu reader, not
    // an external site). Same dark chip as `default` but blue text — pairs
    // visually with the Simplified/Saved MetaStrip tags so the user can tell
    // internal-vs-external reads by color, not just by the external-link icon.
    internal: {
      color: "var(--badge-text)",
      backgroundColor: "var(--action-btn-bg)",
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
        backgroundColor: "var(--action-btn-hover-bg)",
        color: "var(--action-btn-text)",
      },
      muted: {
        backgroundColor: "var(--action-btn-muted-hover-bg)",
        color: "var(--action-btn-muted-hover-text)",
      },
      internal: {
        backgroundColor: "var(--action-btn-hover-bg)",
        color: "var(--badge-text)",
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
