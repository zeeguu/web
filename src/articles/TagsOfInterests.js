import { useEffect, useState } from "react";
import useSelectInterest from "../hooks/useSelectInterest";
import React from "react";
import SweetAlert from "react-bootstrap-sweetalert";
import strings from "../i18n/definitions";
import * as s from "./TagsOfInterests.sc";

export default function TagsOfInterests({
  visible,
  api,
  articlesListShouldChange,
}) {
  const { allTopics, subscribedTopics, toggleTopicSubscription } =
    useSelectInterest(api);

  const [subscribedSearches, setSubscribedSearches] = useState(null);
  const [showingSpecialInterestModal, setshowingSpecialInterestModal] =
    useState(false);

  useEffect(() => {
    api.getSubscribedSearchers((data) => {
      setSubscribedSearches(data);
    });
  }, [api]);

  if (!subscribedSearches) return "";

  function removeSearch(search) {
    console.log("unsubscribing from search" + search);
    setSubscribedSearches(
      subscribedSearches.filter((each) => each.id !== search.id),
    );
    api.unsubscribeFromSearch(search);
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

        {allTopics?.map((topic) => (
          <div key={topic.id} addableid={topic.id}>
            <button
              onClick={(e) => toggleTopicSubscription(topic)}
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
