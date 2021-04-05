import * as s from "./TutorialItemCard.sc";

function TutorialItemCard(props) {
  return (
    <>
      <s.StyledTutorialItemCard>
        <div className="vertical-line-border-box">
          <p className="tutorialTitle">{props.headline}</p>
        </div>
        {props.video ?
        <iframe
          width="644"
          height="362"
          src={props.video}
          title={props.headline}
          frameborder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowfullscreen
        /> : <div className="placeholder">This video tutorial is coming soon...</div>}
      </s.StyledTutorialItemCard>
    </>
  );
}

export default TutorialItemCard;
