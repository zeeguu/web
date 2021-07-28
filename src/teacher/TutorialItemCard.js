import React from "react";
import PropTypes from "prop-types";
import * as s from "./TutorialItemCard.sc";
//import strings from "../i18n/definitions";

//https://youtu.be/_u-PAZvHuwQ

// function TutorialItemCard(props) {
//   return (
//     <>
//       <s.StyledTutorialItemCard>
//         <div className="vertical-line-border-box">
//           <p className="tutorialTitle">{props.headline}</p>
//         </div>
//         <div className="placeholder">
//           <p>{strings.tutorialComingSoon}</p>
//         </div>
//       </s.StyledTutorialItemCard>
//     </>
//   );
// }

// export default TutorialItemCard;

const TutorialItemCard = (props, { embedId }) => (
  <s.StyledTutorialItemCard>
    <div className="vertical-line-border-box">
      <p className="tutorialTitle">{props.headline}</p>
    </div>
    <div className="video-responsive">
      <iframe
        width="853"
        height="480"
        src={`https://www.youtube.com/embed/${embedId}`}
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        title="Embedded youtube"
      />
    </div>
  </s.StyledTutorialItemCard>
);

TutorialItemCard.propTypes = {
  embedId: PropTypes.string.isRequired,
};

export default TutorialItemCard;
