import SweetAlert from "react18-bootstrap-sweetalert";
import * as s from "./TagsOfInterests.sc";
import strings from "../i18n/definitions";
import useUnwantedContentPreferences from "../hooks/useUnwantedContentPreferences";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import { useContext, useState } from "react";
import { zeeguuOrange } from "../components/colors";
import { APIContext } from "../contexts/APIContext";

export default function TagsOfFilters({ visible, articlesListShouldChange }) {
  const api = useContext(APIContext);
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
  const [isHoveringAdd, setIsHoveringAdd] = useState(false);

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
          title={strings.addExcludedKeyword}
          placeHolder={strings.interest}
          onConfirm={onConfirm}
          onCancel={onCancel}
        ></SweetAlert>
      )}

      <div
        className="tagsWithFilters"
        style={{ display: visible ? "block" : "none" }}
      >
        {unwantedKeywords && unwantedKeywords.length > 0 ? (
          unwantedKeywords.map((keyword) => (
            <div key={keyword.id} searchremovabeid={keyword.id}>
              <button
                onClick={(e) => removeUnwantedKeyword(keyword)}
                type="button"
                className={"searches"}
              >
                <span className="addableTitle">{keyword.search}</span>
              </button>
            </div>
          ))
        ) : (
          <span style={{ marginBottom: "15rem" }}>
            You don't have any keyword filters.
          </span>
        )}
        <div className="interestsSettings">
          <div
            className="clickable"
            onMouseEnter={() => setIsHoveringAdd(true)}
            onMouseLeave={() => setIsHoveringAdd(false)}
            onClick={(e) => setShowModal(true)}
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
