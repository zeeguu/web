import { useEffect, useState } from "react";
import styled, { keyframes } from "styled-components";

const FlyingWordWrapper = styled.div`
  position: fixed;
  pointer-events: none;
  z-index: 10000;
  font-weight: bold;
  color: #ff8c42;
  font-size: 1.5rem;
  opacity: ${props => props.opacity};
  left: ${props => props.left}px;
  top: ${props => props.top}px;
  transition: all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  text-shadow: 0 2px 4px rgba(0,0,0,0.2);
`;

export default function FlyingWord({ word, startRect, endRect, onAnimationComplete }) {
  const [position, setPosition] = useState({ left: startRect.left, top: startRect.top });
  const [opacity, setOpacity] = useState(1);

  useEffect(() => {
    // Start the animation after a brief delay
    const timer = setTimeout(() => {
      setPosition({ left: endRect.left, top: endRect.top });
      
      // Fade out near the end
      setTimeout(() => {
        setOpacity(0);
      }, 600);
      
      // Call completion callback
      setTimeout(() => {
        onAnimationComplete();
      }, 800);
    }, 50);

    return () => clearTimeout(timer);
  }, [endRect, onAnimationComplete]);

  return (
    <FlyingWordWrapper left={position.left} top={position.top} opacity={opacity}>
      {word}
    </FlyingWordWrapper>
  );
}