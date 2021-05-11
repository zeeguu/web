import { Fragment } from "react";
import { MdExpandLess, MdExpandMore } from "react-icons/md/";
import * as s from "./ViewMoreLessButton.sc";
const ViewMoreLessButton = ({ showLessButton }) => {
  return (
    <s.ViewMoreLessButton>
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
