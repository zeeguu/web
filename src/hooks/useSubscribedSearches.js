import { useEffect, useRef, useState } from "react";

// The learner's saved searches ("keywords"): the Evergreen pills, and terms
// that also shape the News ranking. Loads only these, not the topics.
//
// subscribedSearches is undefined until the list has loaded. A term being
// saved counts as saved (isSearchKept) until the server answers, so a second
// tap on Keep does nothing instead of saving the keyword twice.
//
// enabled: false skips the request (kiosk mode never shows the filter row).
export default function useSubscribedSearches(api, { enabled = true } = {}) {
  const [subscribedSearches, setSubscribedSearches] = useState();
  const [pendingTerms, setPendingTerms] = useState([]);
  // The state above lags a render behind a double tap; this does not.
  const pendingRef = useRef(new Set());

  useEffect(() => {
    if (!enabled) return;
    api.getSubscribedSearchers((data) => setSubscribedSearches(data));
  }, [api, enabled]);

  const sameTerm = (a, b) => a.toLowerCase() === b.toLowerCase();

  function findSearch(term) {
    return (subscribedSearches || []).find((each) => sameTerm(each.search, term));
  }

  function isSearchKept(term) {
    return !!findSearch(term) || pendingTerms.some((each) => sameTerm(each, term));
  }

  // Returns false when the term was already saved or being saved.
  function subscribeToSearch(term) {
    const key = term.toLowerCase();
    if (findSearch(term) || pendingRef.current.has(key)) return false;
    pendingRef.current.add(key);
    setPendingTerms((terms) => [...terms, term]);
    const done = () => {
      pendingRef.current.delete(key);
      setPendingTerms((terms) => terms.filter((each) => !sameTerm(each, term)));
    };
    api.subscribeToSearch(
      term,
      (data) => {
        // Functional update: the answer can land before the list has loaded,
        // or after it changed again.
        setSubscribedSearches((searches) => [...(searches || []), data]);
        done();
        api.invalidateCache("user_articles/recommended");
      },
      // A failed save leaves Keep tappable again.
      done,
    );
    return true;
  }

  function removeSearch(search) {
    setSubscribedSearches((searches) => (searches || []).filter((each) => each.id !== search.id));
    api.unsubscribeFromSearch(search);
    api.invalidateCache("user_articles/recommended");
  }

  return { subscribedSearches, setSubscribedSearches, findSearch, isSearchKept, subscribeToSearch, removeSearch };
}
