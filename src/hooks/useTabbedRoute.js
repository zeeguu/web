import { useHistory, useLocation } from "react-router-dom";
import useTabSwipe from "./useTabSwipe";

// Wires horizontal swipe gestures to navigation between tab routes.
// `swipeOptions` is forwarded to useTabSwipe to tune sensitivity per surface.
export default function useTabbedRoute(tabPaths, { swipeOptions } = {}) {
  const history = useHistory();
  const location = useLocation();
  const currentTabIndex = tabPaths.indexOf(location.pathname);

  const canSwipe = (direction) => {
    const next = currentTabIndex + direction;
    return currentTabIndex !== -1 && next >= 0 && next < tabPaths.length;
  };
  const onSwipe = (direction) => {
    if (canSwipe(direction)) history.push(tabPaths[currentTabIndex + direction]);
  };

  return useTabSwipe(onSwipe, canSwipe, swipeOptions);
}
