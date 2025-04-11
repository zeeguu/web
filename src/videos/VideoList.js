import React from "react";
import VideoPreview from "./VideoPreview";
import videos from "./Videos.json";

export default function VideoList() {
  return (
    <div>
      <h1>Video List</h1>
      <div>
        {videos.map((video) => (
          <VideoPreview key={video.id} video={video} />
        ))}
      </div>
    </div>
  );
}
