import { useEffect, useState } from "react";
import useSubscribedSearches from "./useSubscribedSearches";

export default function useSelectInterest(api) {
  const [availableTopics, setAvailableTopics] = useState([]);
  const [subscribedTopics, setSubscribedTopics] = useState([]);
  const [allTopics, setAllTopics] = useState([]);
  const { subscribedSearches, setSubscribedSearches, subscribeToSearch, removeSearch } = useSubscribedSearches(api);
  const [showingSpecialInterestModal, setshowingSpecialInterestModal] =
    useState(false);

  useEffect(() => {
    api.getAvailableTopics((data) => {
      setAvailableTopics(data);
    });

    api.getSubscribedTopics((data) => {
      setSubscribedTopics(data);
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
    // Recommendations are cached (5-min TTL); drop the snapshot so the feed
    // reflects the new subscription instead of the pre-change one.
    api.invalidateCache("user_articles/recommended");
  }

  function unsubscribeFromTopic(topic) {
    setSubscribedTopics(
      subscribedTopics.filter((each) => each.id !== topic.id),
    );
    setAvailableTopics([...availableTopics, topic]);
    api.unsubscribeFromTopic(topic);
    api.invalidateCache("user_articles/recommended");
  }

  function toggleTopicSubscription(topic) {
    if (subscribedTopics.includes(topic)) {
      unsubscribeFromTopic(topic);
    } else {
      subscribeToTopic(topic);
    }
  }


  function isSubscribed(topic) {
    return subscribedTopics
      .map((subscribedTopic) => subscribedTopic.id)
      .includes(topic.id)
      ? true
      : false;
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

    showingSpecialInterestModal,
    setshowingSpecialInterestModal,
  };
}
