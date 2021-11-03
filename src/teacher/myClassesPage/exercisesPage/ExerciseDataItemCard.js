import { MdExpandLess, MdExpandMore } from "react-icons/md";
import strings from "../../../i18n/definitions";
import { darkBlue, lightBlue } from "../../../components/colors";
import * as s from "../../styledComponents/ExerciseDataItemCard.sc";

const ExerciseDataItemCard = (props) => {
  const setBorderColor = props.isOpen ? darkBlue : lightBlue;
  return (
    <s.StyledExerciseDataItemCard>
      <div
        style={{
          border: `solid 5px ${setBorderColor}`,
        }}
        className="exercise-data-item-card-box"
      >
        <h3 className="exercise-item-card-headline">{props.headline}</h3>
        <div className="exercise-data-item-inner-box">{props.children}</div>
        {!props.isOpen ? (
          <div className="view-more-box">
            <p className="view-more-btn-text">{strings.viewMoreBtn}</p>
            <MdExpandMore className="view-more-icon" />
          </div>
        ) : (
          <div className="view-less-box">
            <p className="view-less-btn-text">{strings.viewLessBtn}</p>
            <MdExpandLess className="view-less-icon" />
          </div>
        )}
      </div>
    </s.StyledExerciseDataItemCard>
  );
};

export default ExerciseDataItemCard;
