import { useEffect, useState } from "react";
import Feature from "../features/Feature";

export default function useUnwantedContentPreferences(api) {
  const useNewTopics = Feature.new_topics();
  const [topicsAvailableForExclusion, setTopicsAvailableForExclusion] =
    useState([]);
  const [excludedTopics, setExcludedTopics] = useState([]);
  const [unwantedKeywords, setUnwantedKeywords] = useState([]);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (useNewTopics) {
      api.newTopicsAvailableForExclusion((topics) => {
        setTopicsAvailableForExclusion(topics);
      });

      api.getExcludedNewTopics((filters) => {
        setExcludedTopics(filters);
      });
    } else {
      api.topicsAvailableForExclusion((topics) => {
        setTopicsAvailableForExclusion(topics);
      });

      api.getExcludedTopics((filters) => {
        setExcludedTopics(filters);
      });
    }

    api.getUnwantedKeywords((keywords) => {
      setUnwantedKeywords(keywords);
    });
  }, [api]);

  function excludeTopic(topic) {
    setExcludedTopics([...excludedTopics, topic]);
    if (useNewTopics) {
      api.excludeNewTopic(topic);
    } else {
      api.excludeTopic(topic);
    }
  }

  function unexcludeTopic(topic) {
    setExcludedTopics(excludedTopics.filter((each) => each.id !== topic.id));
    if (useNewTopics) {
      api.unexcludeNewTopic(topic);
    } else {
      api.unexcludeTopic(topic);
    }
  }

  function toggleTopicExclusion(topic) {
    if (excludedTopics.map((e) => e.id).includes(topic.id)) {
      unexcludeTopic(topic);
    } else {
      excludeTopic(topic);
    }
  }

  function addUnwantedKeyword(keyword) {
    api.addUnwantedKeyword(keyword, (data) => {
      setUnwantedKeywords([...unwantedKeywords, data]);
    });
  }

  function removeUnwantedKeyword(keyword) {
    api.removeUnwantedKeyword(keyword);
    setUnwantedKeywords(
      unwantedKeywords.filter((each) => each.id !== keyword.id),
    );
  }

  function isExcludedTopic(topic) {
    return excludedTopics.map((each) => each.id).includes(topic.id);
  }

  return {
    topicsAvailableForExclusion,
    excludedTopics,
    toggleTopicExclusion,
    isExcludedTopic,
    excludeTopic,
    unexcludeTopic,

    unwantedKeywords,
    setUnwantedKeywords,
    addUnwantedKeyword,
    removeUnwantedKeyword,

    showModal,
    setShowModal,
  };
}
