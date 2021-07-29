import React from "react";
import * as s from "./TutorialItemCard.sc";

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

//source: https://dev.to/bravemaster619/simplest-way-to-embed-a-youtube-video-in-your-react-app-3bk2

const TutorialItemCard = ({ embedId }) => (
  <s.StyledTutorialItemCard>
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

export default TutorialItemCard;
