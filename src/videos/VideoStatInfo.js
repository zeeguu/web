import * as s from "../components/ArticleStatInfo.sc";
import { getStaticPath } from "../utils/misc/staticPath";
import QueryBuilderIcon from '@mui/icons-material/QueryBuilder';

export default function VideoStatInfo({ video }) {
  let cefr_level = video.metrics.cefr_level;
  return (
    <s.StatContainer>
      <s.Difficulty>
        <img
          src={getStaticPath("icons", cefr_level + "-level-icon.png")}
          alt="difficulty icon"
        ></img>
        <span>{cefr_level}</span>
      </s.Difficulty>
      <s.ReadingTimeContainer>
        <QueryBuilderIcon />
        <span>~ {Math.round(video.duration / 60)} min</span>
      </s.ReadingTimeContainer>
    </s.StatContainer>
  );
}