import { useHistory, useLocation } from "react-router-dom";
import useTabSwipe from "./useTabSwipe";

// Wires horizontal swipe gestures to navigation between tab routes.
// `pathAliases` maps non-tab paths to the tab they conceptually belong to
// (e.g. /search → /articles/mySearches), so swipes from a child route
// still know where to go next.
export default function useTabbedRoute(tabPaths, { pathAliases = {} } = {}) {
  const history = useHistory();
  const location = useLocation();
  const effectivePath = pathAliases[location.pathname] || location.pathname;
  const currentTabIndex = tabPaths.indexOf(effectivePath);

  const canSwipe = (direction) => {
    const next = currentTabIndex + direction;
    return currentTabIndex !== -1 && next >= 0 && next < tabPaths.length;
  };
  const onSwipe = (direction) => {
    if (canSwipe(direction)) history.push(tabPaths[currentTabIndex + direction]);
  };

  return useTabSwipe(onSwipe, canSwipe);
}
