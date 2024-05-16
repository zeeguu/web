import { useEffect, useState } from "react";

export default function useUnwantedContentPreferences(api) {
  const [toipcsAvailableForFiltering, setToipcsAvailableForFiltering] =
    useState([]);
  const [subscribedFilters, setSubscribedFilters] = useState([]);
  const [subscribedSearchFilters, setSubscribedSearchFilters] = useState([]);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    api.availableFilters((topics) => {
      setToipcsAvailableForFiltering(topics);
    });

    api.getFilteredTopics((filters) => {
      setSubscribedFilters(filters);
    });

    api.getSubscribedFilterSearches((filters) => {
      setSubscribedSearchFilters(filters);
    });
  }, [api]);

  function subscribeToFilter(filter) {
    setSubscribedFilters([...subscribedFilters, filter]);
    api.subscribeToFilter(filter);
  }

  function unsubscribeFromFilter(filter) {
    setSubscribedFilters(
      subscribedFilters.filter((each) => each.id !== filter.id),
    );
    api.unsubscribeFromFilter(filter);
  }

  function toggleFilterSubscription(filter) {
    if (subscribedFilters.map((e) => e.id).includes(filter.id)) {
      unsubscribeFromFilter(filter);
    } else {
      subscribeToFilter(filter);
    }
  }

  //subscribe to custom interest filter
  function subscribeToSearchFilter(response) {
    api.subscribeToSearchFilter(response, (data) => {
      setSubscribedSearchFilters([...subscribedSearchFilters, data]);
    });
  }

  //remove custom interest filter
  function removeSearchFilter(search) {
    api.unsubscribeFromSearchFilter(search);
    setSubscribedSearchFilters(
      subscribedSearchFilters.filter((each) => each.id !== search.id),
    );
  }

  function isSubscribedSearchFilter(filter) {
    return subscribedFilters
      .map((subscribedFilter) => subscribedFilter.id)
      .includes(filter.id)
      ? true
      : false;
  }

  return {
    toipcsAvailableForFiltering,
    subscribedFilters,
    toggleFilterSubscription,
    isSubscribedSearchFilter,

    subscribeToFilter,
    unsubscribeFromFilter,

    subscribedSearchFilters,
    setSubscribedSearchFilters,
    subscribeToSearchFilter,
    removeSearchFilter,

    showModal,
    setShowModal,
  };
}
