import { Link } from "react-router-dom";
import * as s from "./ArticlePreview.sc";
import Feature from "../features/Feature";
import { useMemo } from "react";
import {
  InterestButton,
  variants,
} from "../components/interestButton/InterestButton";
import { levels, LevelLabel } from "../components/levelLabel/LevelLabel";
import { TimeLabel } from "../components/timeLabel/TimeLabel";

const maxArticleTitleLength = 70;
const maxArticleLength = 230;
const wordCountPerMin = 80;

export default function ArticleOverview({
  article,
  dontShowImage,
  hasExtension,
}) {
  let readingTime = Math.round(article.metrics.word_count / wordCountPerMin);

  let topics = useMemo(
    () => article?.topics?.split(" ").filter((topic) => topic !== ""),
    []
  );

  const articleTitle = useMemo(
    () =>
      article.title.length > maxArticleTitleLength
        ? `${article.title.slice(0, maxArticleTitleLength)}...`
        : article.title,
    []
  );

  const articleText = useMemo(
    () =>
      article.summary.length > maxArticleLength
        ? `${article.summary.slice(0, maxArticleLength)}...`
        : article.summary,
    []
  );

  const difficulty = useMemo(() => {
    const countedDifficulty = Math.round(article.metrics.difficulty * 100) / 10;

    if (countedDifficulty >= 0 && countedDifficulty < 4) return levels.easy;
    if (countedDifficulty >= 4 && countedDifficulty < 8) return levels.fair;
    if (countedDifficulty >= 8) return levels.challenging;
  }, []);

  return (
    <s.ArticlePreview>
      <div
        style={{
          marginBottom: "18px",
        }}
      >
        <s.Title>
          {article?.has_personal_copy ||
          article?.has_uploader ||
          article?.video ||
          (!Feature.extension_experiment1() && !hasExtension) ? (
            <s.TitleBox>
              <Link to={`/read/article?id=${article.id}`}>{articleTitle}</Link>
              <div style={{ display: "inline-block", marginLeft: "15px" }}>
                <TimeLabel title={`${readingTime} min`} />
                <LevelLabel level={difficulty} />
              </div>
            </s.TitleBox>
          ) : (
            <s.TitleBox>
              <a target="_blank" href={article.url}>
                {articleTitle}
              </a>
              <s.LabelsBox>
                <TimeLabel title={`${readingTime} min`} />
                <LevelLabel level={difficulty} />
              </s.LabelsBox>
            </s.TitleBox>
          )}
        </s.Title>
        <s.Summary>{articleText}</s.Summary>
      </div>

      <s.ArticleFooterBox>
        {!dontShowImage && (
          <s.SourceImage>
            <img
              src={"/news-icons/" + article?.icon_name}
              alt={article?.icon_name || ""}
            />
          </s.SourceImage>
        )}

        <s.TopicsBox>
          {topics?.map((topic) => (
            <InterestButton
              key={topic}
              variant={variants.grayOutlined}
              title={topic}
            ></InterestButton>
          ))}
        </s.TopicsBox>
      </s.ArticleFooterBox>
    </s.ArticlePreview>
  );
}
