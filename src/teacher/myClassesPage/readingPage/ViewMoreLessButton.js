import { useEffect, useState } from "react";
import { MdExpandLess, MdExpandMore } from "react-icons/md/";
import strings from "../../../i18n/definitions";
import * as s from "../../styledComponents/ViewMoreLessButton.sc";

const ViewMoreLessButton = ({ sessionID, openedArticle, isFirst }) => {
  const [showLessButton, setShowLessButton] = useState(false);

  useEffect(() => {
    if (sessionID === openedArticle) {
      setShowLessButton(true);
    } else {
      setShowLessButton(false);
    }
    //eslint-disable-next-line
  }, [openedArticle]);

  return (
    <s.ViewMoreLessButton isFirst={isFirst}>
        {!showLessButton ? (
          <div className="wrapper">
            <p>{strings.viewMoreBtn}</p>
            <MdExpandMore className="expansionIcon" />
          </div>
        ) : (
          <div className="wrapper">
            <p className="viewLess">{strings.viewLessBtn}</p>
            <MdExpandLess className="expansionIcon" />
          </div>
        )}
    </s.ViewMoreLessButton>
  );
};
export default ViewMoreLessButton;
