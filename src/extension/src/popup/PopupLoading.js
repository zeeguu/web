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

  return showLoader === true ? (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', padding: '20px' }}>
      <LoadingCircle />
      <span style={{ fontSize: '12px', color: '#666' }}>Analyzing page...</span>
    </div>
  ) : null;
}
