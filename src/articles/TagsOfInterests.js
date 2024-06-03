import { useEffect, useState } from "react";
import React from "react";
import SweetAlert from "react-bootstrap-sweetalert";
import strings from "../i18n/definitions";
import * as s from "./TagsOfInterests.sc";
import Feature from "../features/Feature";

export default function TagsOfInterests({
  visible,
  api,
  articlesListShouldChange,
}) {
  const [availableTopics, setInterestingTopics] = useState(null);
  const [subscribedTopics, setSubscribedTopics] = useState(null);
  const [subscribedSearches, setSubscribedSearches] = useState(null);
  const [showingSpecialInterestModal, setshowingSpecialInterestModal] =
    useState(false);

  useEffect(() => {
    if (Feature.new_topics()) {
      api.getAvailableNewTopics((data) => {
        setInterestingTopics(data);
      });

      api.getSubscribedNewTopics((data) => {
        setSubscribedTopics(data);
      });
    } else {
      console.log("No feature!");
      api.getAvailableTopics((data) => {
        setInterestingTopics(data);
      });

      api.getSubscribedTopics((data) => {
        setSubscribedTopics(data);
      });
    }

    api.getSubscribedSearchers((data) => {
      setSubscribedSearches(data);
    });
  }, [api]);

  if (!availableTopics || !subscribedTopics || !subscribedSearches) return "";

  let allTopics = [...availableTopics, ...subscribedTopics];
  allTopics.sort((a, b) => a.title.localeCompare(b.title));

  function subscribeToTopicOfInterest(topic) {
    setSubscribedTopics([...subscribedTopics, topic]);
    setInterestingTopics(
      availableTopics.filter((each) => each.id !== topic.id),
    );
    api.subscribeToTopic(topic);
  }

  function subscribeToNewTopicOfInterest(topic) {
    setSubscribedTopics([...subscribedTopics, topic]);
    setInterestingTopics(
      availableTopics.filter((each) => each.id !== topic.id),
    );
    api.subscribeToNewTopic(topic);
  }
  function unsubscribeFromTopicOfInterest(topic) {
    setSubscribedTopics(
      subscribedTopics.filter((each) => each.id !== topic.id),
    );
    setInterestingTopics([...availableTopics, topic]);
    api.unsubscribeFromTopic(topic);
  }

  function unsubscribeFromNewTopicOfInterest(topic) {
    setSubscribedTopics(
      subscribedTopics.filter((each) => each.id !== topic.id),
    );
    setInterestingTopics([...availableTopics, topic]);
    api.unsubscribeFromNewTopic(topic);
  }

  function removeSearch(search) {
    console.log("unsubscribing from search" + search);
    setSubscribedSearches(
      subscribedSearches.filter((each) => each.id !== search.id),
    );
    api.unsubscribeFromSearch(search);
  }

  function toggleInterest(topic) {
    if (subscribedTopics.includes(topic)) {
      if (Feature.new_topics()) unsubscribeFromNewTopicOfInterest(topic);
      else unsubscribeFromTopicOfInterest(topic);
    } else {
      if (Feature.new_topics()) subscribeToNewTopicOfInterest(topic);
      else subscribeToTopicOfInterest(topic);
    }
  }

  const onConfirm = (response) => {
    api.subscribeToSearch(response, (data) => {
      setSubscribedSearches([...subscribedSearches, data]);
    });

    setshowingSpecialInterestModal(false);
  };

  const onCancel = () => {
    setshowingSpecialInterestModal(false);
  };

  return (
    <s.TagsOfInterests>
      {showingSpecialInterestModal && (
        <SweetAlert
          input
          showCancel
          title={strings.addPersonalInterest}
          placeHolder={strings.interest}
          onConfirm={onConfirm}
          onCancel={onCancel}
        ></SweetAlert>
      )}

      <div
        className="tagsOfInterests"
        style={{ display: visible ? "block" : "none" }}
      >
        <div className="interestsSettings">
          <button
            className="addInterestButton"
            onClick={(e) => setshowingSpecialInterestModal(true)}
          >
            ＋
          </button>
          <button
            className="closeTagsOfInterests"
            onClick={(e) => articlesListShouldChange()}
          >
            {strings.save}
          </button>
        </div>

        {allTopics.map((topic) => (
          <div key={topic.id} addableid={topic.id}>
            <button
              onClick={(e) => toggleInterest(topic)}
              type="button"
              className={
                "interests " +
                (subscribedTopics.map((e) => e.id).includes(topic.id)
                  ? ""
                  : "unsubscribed")
              }
            >
              <span className="addableTitle">{topic.title}</span>
            </button>
          </div>
        ))}

        {subscribedSearches.map((search) => (
          <div key={search.id} searchremovabeid={search.id}>
            <button
              onClick={(e) => removeSearch(search)}
              type="button"
              className={"interests"}
            >
              <span className="addableTitle">{search.search}</span>
            </button>
          </div>
        ))}
      </div>
    </s.TagsOfInterests>
  );
}
