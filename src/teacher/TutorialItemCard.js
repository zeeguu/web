import * as s from "./TutorialItemCard.sc";
import strings from "../i18n/definitions";

function TutorialItemCard(props) {
  return (
    <>
      <s.StyledTutorialItemCard>
        <div className="vertical-line-border-box">
          <p className="tutorialTitle">{props.headline}</p>
        </div>
        <div className="placeholder">
          <p>{strings.tutorialComingSoon}</p>
        </div>
      </s.StyledTutorialItemCard>
    </>
  );
}

export default TutorialItemCard;
