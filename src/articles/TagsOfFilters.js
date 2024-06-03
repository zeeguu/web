import SweetAlert from "react-bootstrap-sweetalert";
import * as s from "./TagsOfInterests.sc";
import strings from "../i18n/definitions";
import useUnwantedContentPreferences from "../hooks/useUnwantedContentPreferences";

export default function TagsOfFilters({
  visible,
  api,
  articlesListShouldChange,
}) {
  // UPDATE NEW TOPICS
  const {
    topicsAvailableForExclusion,
    toggleTopicExclusion,
    isExcludedTopic,

    unwantedKeywords,
    addUnwantedKeyword,
    removeUnwantedKeyword,

    showModal,
    setShowModal,
  } = useUnwantedContentPreferences(api);

  const onConfirm = (response) => {
    addUnwantedKeyword(response);
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

        {topicsAvailableForExclusion.map((topic) => (
          <div key={topic.id} addableid={topic.id}>
            <button
              onClick={(e) => toggleTopicExclusion(topic)}
              type="button"
              className={`interests ${!isExcludedTopic(topic) && "unsubscribed"}`}
            >
              <span className="addableTitle">{topic.title}</span>
            </button>
          </div>
        ))}

        {unwantedKeywords.map((keyword) => (
          <div key={keyword.id} searchremovabeid={keyword.id}>
            <button
              onClick={(e) => removeUnwantedKeyword(keyword)}
              type="button"
              className={"interests"}
            >
              <span className="addableTitle">{keyword.search}</span>
            </button>
          </div>
        ))}
      </div>
    </s.TagsOfInterests>
  );
}
