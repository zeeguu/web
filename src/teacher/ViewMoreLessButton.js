import { Fragment, useEffect, useState } from "react";
import { MdExpandLess, MdExpandMore } from "react-icons/md/";
import * as s from "./ViewMoreLessButton.sc";
const ViewMoreLessButton = ({ articleID, openedArticle, isFirst }) => {
  const [showLessButton, setShowLessButton] = useState(false);

  useEffect(() => {
    if (articleID === openedArticle) {
      setShowLessButton(true);
    } else {
      setShowLessButton(false);
    }
    //eslint-disable-next-line
  }, [openedArticle]);

  return (
    <s.ViewMoreLessButton isFirst={isFirst}>
      <Fragment>
        {!showLessButton ? (
          <div className="wrapper">
            <p>View more</p>
            <MdExpandMore className="expansionIcon" />
          </div>
        ) : (
          <div className="wrapper">
            <p className="viewLess">View less</p>
            <MdExpandLess className="expansionIcon" />
          </div>
        )}
      </Fragment>
    </s.ViewMoreLessButton>
  );
};
export default ViewMoreLessButton;
