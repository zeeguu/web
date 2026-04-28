import { useEffect, useRef } from "react";

export function useScrollActiveIntoView(activeKey) {
  const refs = useRef({});
  useEffect(() => {
    refs.current[activeKey]?.scrollIntoView({
      behavior: "smooth",
      inline: "center",
      block: "nearest",
    });
  }, [activeKey]);
  return (key) => (el) => {
    if (el) refs.current[key] = el;
  };
}
