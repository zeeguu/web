import { useState, useEffect } from "react";

export default function useScreenWidth() {
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);

  useEffect(() => {
    let debounceTimeout;

    const handleResize = () => {
      clearTimeout(debounceTimeout);

      debounceTimeout = setTimeout(() => {
        setScreenWidth(window.innerWidth);
      }, 200);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      clearTimeout(debounceTimeout);
    };
  }, []);

  return { screenWidth };
}
