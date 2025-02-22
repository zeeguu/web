import { MdExpandLess, MdExpandMore } from "react-icons/md/";
import strings from "../../../i18n/definitions";
import * as s from "../../styledComponents/ViewMoreLessButton.sc";

const ViewMoreLessButton = ({ isOpen, isFirst }) => {
  return (
    <s.ViewMoreLessButton isFirst={isFirst}>
      <div className="wrapper">
        {!isOpen ? (
          <>
            <p>{strings.viewMoreBtn}</p>
            <MdExpandMore className="expansionIcon" />
          </>
        ) : (
          <>
            <p className="viewLess">{strings.viewLessBtn}</p>
            <MdExpandLess className="expansionIcon" />
          </>
        )}
      </div>
    </s.ViewMoreLessButton>
  );
};
export default ViewMoreLessButton;
