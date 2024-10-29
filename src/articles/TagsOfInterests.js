import { useState } from "react";
import useSelectInterest from "../hooks/useSelectInterest";
import React from "react";
import SweetAlert from "react18-bootstrap-sweetalert";
import strings from "../i18n/definitions";
import * as s from "./TagsOfInterests.sc";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import { zeeguuOrange } from "../components/colors";

export default function TagsOfInterests({
  visible,
  api,
  articlesListShouldChange,
}) {
  // Update NEW TOPICS
  const {
    allTopics,

    toggleTopicSubscription,
    isSubscribed,

    subscribedSearches,
    subscribeToSearch,
    removeSearch,

    showingSpecialInterestModal,
    setshowingSpecialInterestModal,
  } = useSelectInterest(api);
  const [isHoveringAdd, setIsHoveringAdd] = useState(false);

  const onConfirm = (response) => {
    subscribeToSearch(response);
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
        style={{
          display: visible ? "block" : "none",
        }}
      >
        <div>
          {subscribedSearches && subscribedSearches.length > 0 ? (
            subscribedSearches.map((search) => (
              <div key={search.id} searchremovabeid={search.id}>
                <button
                  onClick={(e) => removeSearch(search)}
                  type="button"
                  className={"searches"}
                >
                  <span className="addableTitle">{search.search}</span>
                </button>
              </div>
            ))
          ) : (
            <span style={{ marginBottom: "15rem" }}>
              You don't have any keyword interests.
            </span>
          )}
        </div>
        <div className="interestsSettings">
          <div
            className="clickable"
            onClick={(e) => setshowingSpecialInterestModal(true)}
            onMouseEnter={() => setIsHoveringAdd(true)}
            onMouseLeave={() => setIsHoveringAdd(false)}
          >
            {isHoveringAdd ? (
              <AddCircleIcon
                sx={{ fontSize: "2rem" }}
                style={{ color: zeeguuOrange }}
              />
            ) : (
              <AddCircleOutlineIcon
                sx={{ fontSize: "2rem" }}
                style={{ color: zeeguuOrange }}
              />
            )}
          </div>
          <button
            className="closeTagsOfInterests"
            onClick={(e) => articlesListShouldChange()}
          >
            {strings.apply}
          </button>
        </div>
      </div>
    </s.TagsOfInterests>
  );
}
