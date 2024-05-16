import SweetAlert from "react-bootstrap-sweetalert";
import * as s from "./TagsOfInterests.sc";
import strings from "../i18n/definitions";
import useUnwantedContentPreferences from "../hooks/useUnwantedContentPreferences";

export default function TagsOfFilters({
  visible,
  api,
  articlesListShouldChange,
}) {
  const {
    availableFilters,
    toggleFilterSubscription,
    isSubscribedSearchFilter,

    subscribedSearchFilters,
    subscribeToSearchFilter,
    removeSearchFilter,

    showModal,
    setShowModal,
  } = useUnwantedContentPreferences(api);

  const onConfirm = (response) => {
    subscribeToSearchFilter(response);
    setShowModal(false);
  };

  const onCancel = () => {
    setShowModal(false);
  };

  return (
    <s.TagsOfInterests>
      {showModal && (
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
            onClick={(e) => setShowModal(true)}
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

        {availableFilters.map((filter) => (
          <div key={filter.id} addableid={filter.id}>
            <button
              onClick={(e) => toggleFilterSubscription(filter)}
              type="button"
              className={`interests ${!isSubscribedSearchFilter(filter) && "unsubscribed"}`}
            >
              <span className="addableTitle">{filter.title}</span>
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
