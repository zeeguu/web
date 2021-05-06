import * as s from "./TutorialItemCard.sc";

function TutorialItemCard(props) {
  return (
    <>
      <s.StyledTutorialItemCard>
        <div className="vertical-line-border-box">
          <p className="tutorialTitle">{props.headline}</p>
        </div>
          <div className="placeholder">
            <p>This video tutorial is coming soon...(STRINGS)</p>
          </div>
      </s.StyledTutorialItemCard>
    </>
  );
}

export default TutorialItemCard;
