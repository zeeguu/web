import { useState, useRef } from "react";

export default function useRefresh(onRefresh) {
  const [refreshing, setRefreshing] = useState(false);
  const onRefreshRef = useRef(onRefresh);
  onRefreshRef.current = onRefresh;

  function refresh() {
    setRefreshing(true);
    Promise.resolve(onRefreshRef.current()).finally(() => {
      setRefreshing(false);
    });
  }

  return { refreshing, refresh };
}
