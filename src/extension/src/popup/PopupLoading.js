import { useEffect } from "react";
import { LoadingCircle } from "./PopupLoading.styles";

export default function PopupLoading({ showLoader, setShowLoader }) {
  // Only show loader if this component is visible more than 100 ms
  useEffect(() => {
    let timer = setTimeout(() => {
      setShowLoader(true);
    }, 100);
    return () => {
      clearTimeout(timer);
    };
  }, []);

  return showLoader === true ? <LoadingCircle /> : null;
}
