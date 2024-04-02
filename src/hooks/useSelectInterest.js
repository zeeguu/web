import { useEffect, useState } from "react";

export default function useSelectInterest(api) {
  const [availableTopics, setAvailableTopics] = useState(null);
  const [subscribedTopics, setSubscribedTopics] = useState(null);
  const [allTopics, setAllTopics] = useState(null);

  useEffect(() => {
    api.getAvailableTopics((data) => {
      setAvailableTopics(data);
    });

    api.getSubscribedTopics((data) => {
      setSubscribedTopics(data);
    });
  }, [api]);



  useEffect(() => {
    if (availableTopics && subscribedTopics) {
      let newAllTopics = [...availableTopics, ...subscribedTopics];
      newAllTopics.sort((a, b) => a.title.localeCompare(b.title));
      setAllTopics(newAllTopics);
    }
  }, [availableTopics, subscribedTopics]);


  if (!availableTopics || !subscribedTopics) return "";
  if (!allTopics) return "";

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
  return {
    toggleTopicSubscription,
    subscribedTopics,
    availableTopics,
    allTopics,
  };
}
