import { useState, useEffect, useRef } from "react";

export default function useScreenWidth() {
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);
  const debounceTimeout = useRef(0); // initialize with an int that will represent the timeout id

  const handleResize = () => {
    clearTimeout(debounceTimeout.current);
    debounceTimeout.current = setTimeout(() => {
      setScreenWidth(window.innerWidth);
    }, 200);
  };

  useEffect(() => {
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      clearTimeout(debounceTimeout.current);
    };
  }, []);

  return { screenWidth };
}
