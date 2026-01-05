import { useState } from "react";
import { isDev } from "../config";

/**
 * A button that only renders in development mode.
 *
 * Usage:
 *   <DevButton onClick={() => doThing()}>Do Thing</DevButton>
 *   <DevButton onClick={() => dangerousThing()} confirmMessage="Are you sure?">Dangerous</DevButton>
 */
export default function DevButton({ children, onClick, confirmMessage, style, ...props }) {
  const [isHovered, setIsHovered] = useState(false);

  if (!isDev) return null;

  const handleClick = () => {
    if (confirmMessage) {
      if (window.confirm(confirmMessage)) {
        onClick();
      }
    } else {
      onClick();
    }
  };

  const baseStyle = {
    padding: "0.5em 1em",
    backgroundColor: isHovered ? "#ff5252" : "#ff6b6b",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "0.85em",
    transition: "background-color 0.2s",
    ...style,
  };

  return (
    <button
      style={baseStyle}
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      {...props}
    >
      {children}
    </button>
  );
}
