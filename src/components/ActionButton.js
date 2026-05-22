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
    // For destructive-or-secondary actions that should de-emphasize next to
    // a primary CTA — renders as plain underlined text, no button chrome.
    // Used e.g. for "Remove" once an article is already saved: Open is the
    // affirmative action, Remove is the rare destructive one, so it shouldn't
    // carry the same visual weight.
    link: {
      color: "var(--text-muted)",
      backgroundColor: "transparent",
      border: "none",
      padding: "2px 6px",
      fontWeight: 400,
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
      link: {
        color: "var(--text-primary)",
        backgroundColor: "transparent",
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
