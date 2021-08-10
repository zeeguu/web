import React from "react";
import * as s from "./TutorialItemCard.sc";
import LoadingAnimation from "../components/LoadingAnimation";

//source: https://dev.to/bravemaster619/simplest-way-to-embed-a-youtube-video-in-your-react-app-3bk2

const TutorialItemCard = ({ embedId }) => (
  <s.StyledTutorialItemCard>
    <div className="video-responsive">
      <LoadingAnimation />
      <iframe
        src={`https://www.youtube.com/embed/${embedId}`}
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        title="Tutorial video"
      />
    </div>
  </s.StyledTutorialItemCard>
);

export default TutorialItemCard;
