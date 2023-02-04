import { useEffect, useState } from "react";
import React from "react";
import SweetAlert from "react-bootstrap-sweetalert";
import * as s from "./TagsOfInterests.sc";
import strings from "../i18n/definitions";

export default function TagsOfFilters({
  visible,
  api,
  articlesListShouldChange,
}) {
  const [availableFilters, setAvailableFilters] = useState(null);
  const [subscribedFilters, setSubscribedFilters] = useState(null);
  const [subscribedSearchFilters, setSubscribedSearchFilters] = useState(null);
  const [showingModal, setShowingModal] = useState(false);

  useEffect(() => {
    api.availableFilters((topics) => {
      setAvailableFilters(topics);
    });

    api.getFilteredTopics((filters) => {
      setSubscribedFilters(filters);
    });

    api.getSubscribedFilterSearches((filters) => {
      setSubscribedSearchFilters(filters);
    });
  }, [api]);

  if (!availableFilters | !subscribedFilters | !subscribedSearchFilters)
    return "";

  function subscribeToFilter(filter) {
    setSubscribedFilters([...subscribedFilters, filter]);
    api.subscribeToFilter(filter);
  }

  function unsubscribeFromFilter(filter) {
    setSubscribedFilters(
      subscribedFilters.filter((each) => each.id !== filter.id)
    );
    api.unsubscribeFromFilter(filter);
  }

  function removeSearchFilter(search) {
    api.unsubscribeFromSearchFilter(search);
    setSubscribedSearchFilters(
      subscribedSearchFilters.filter((each) => each.id !== search.id)
    );
  }

  function toggleFilter(filter) {
    if (subscribedFilters.map((e) => e.id).includes(filter.id)) {
      unsubscribeFromFilter(filter);
    } else {
      subscribeToFilter(filter);
    }
  }

  const onConfirm = (response) => {
    api.subscribeToSearchFilter(response, (data) => {
      setSubscribedSearchFilters([...subscribedSearchFilters, data]);
    });

    setShowingModal(false);
  };

  const onCancel = () => {
    setShowingModal(false);
  };

  return (
    <s.TagsOfInterests>
      {showingModal && (
        <SweetAlert
          input
          showCancel
          title={strings.addPersonalFilter}
          placeHolder={strings.interest}
          onConfirm={onConfirm}
          onCancel={onCancel}
        ></SweetAlert>
      )}

      <div
        className="tagsWithFilters"
        style={{ display: visible ? "block" : "none" }}
      >
        <div className="interestsSettings">
          <button
            className="addInterestButton"
            onClick={(e) => setShowingModal(true)}
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

        {availableFilters.map((f) => (
          <div key={f.id} addableid={f.id}>
            <button
              onClick={(e) => toggleFilter(f)}
              type="button"
              className={
                "interests " +
                (subscribedFilters.map((e) => e.id).includes(f.id)
                  ? ""
                  : "unsubscribed")
              }
            >
              <span className="addableTitle">{f.title}</span>
            </button>
          </div>
        ))}

        {subscribedSearchFilters.map((search) => (
          <div key={search.id} searchremovabeid={search.id}>
            <button
              onClick={(e) => removeSearchFilter(search)}
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
