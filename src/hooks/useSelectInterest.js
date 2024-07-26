import { useEffect, useState } from "react";

export default function useSelectInterest(api) {
  const [availableTopics, setAvailableTopics] = useState([]);
  const [subscribedTopics, setSubscribedTopics] = useState([]);
  const [allTopics, setAllTopics] = useState([]);
  const [subscribedSearches, setSubscribedSearches] = useState();
  const [showingSpecialInterestModal, setshowingSpecialInterestModal] =
    useState(false);

  useEffect(() => {
    api.getAvailableTopics((data) => {
      setAvailableTopics(data);
    });

    api.getSubscribedTopics((data) => {
      setSubscribedTopics(data);
    });

    //custom interest filters
    api.getSubscribedSearchers((data) => {
      setSubscribedSearches(data);
    });
  }, [api]);

  useEffect(() => {
    let newAllTopics = [...availableTopics, ...subscribedTopics];
    newAllTopics.sort((a, b) => a.title.localeCompare(b.title));
    setAllTopics(newAllTopics);
  }, [availableTopics, subscribedTopics]);

  function subscribeToTopic(topic) {
    setSubscribedTopics([...subscribedTopics, topic]);
    setAvailableTopics(availableTopics.filter((each) => each.id !== topic.id));
    api.subscribeToTopic(topic);
  }

  function unsubscribeFromTopic(topic) {
    setSubscribedTopics(
      subscribedTopics.filter((each) => each.id !== topic.id),
    );
    setAvailableTopics([...availableTopics, topic]);
    api.unsubscribeFromTopic(topic);
  }

  function toggleTopicSubscription(topic) {
    if (subscribedTopics.includes(topic)) {
      unsubscribeFromTopic(topic);
    } else {
      subscribeToTopic(topic);
    }
  }

  //subscribe to custom interest filter
  function subscribeToSearch(response) {
    api.subscribeToSearch(response, (data) => {
      setSubscribedSearches([...subscribedSearches, data]);
    });
  }

  //remove custom interest filter
  function removeSearch(search) {
    console.log("unsubscribing from search" + search);
    setSubscribedSearches(
      subscribedSearches.filter((each) => each.id !== search.id),
    );
    api.unsubscribeFromSearch(search);
  }

  function isSubscribed(topic) {
    return subscribedTopics
      .map((subscribedTopic) => subscribedTopic.id)
      .includes(topic.id)
      ? true
      : false;
  }

  function subscribeToEmail(search) {
    api.subscribeToEmailSearch(search, (data) => {
      setSubscribedSearches((prevSearches) =>
        prevSearches.map((entry) =>
          entry.search === search ? { ...entry, receive_email: true } : entry,
        ),
      );
    });
  }

  function unsubscribeFromEmail(search) {
    api.unsubscribeFromEmailSearch(search, (data) => {
      setSubscribedSearches((prevSearches) =>
        prevSearches.map((entry) =>
          entry.search === search ? { ...entry, receive_email: false } : entry,
        ),
      );
    });
  }

  return {
    allTopics,

    availableTopics,
    subscribedTopics,
    toggleTopicSubscription,
    isSubscribed,

    subscribedSearches,
    setSubscribedSearches,
    subscribeToSearch,
    removeSearch,
    subscribeToEmail,
    unsubscribeFromEmail,

    showingSpecialInterestModal,
    setshowingSpecialInterestModal,
  };
}
