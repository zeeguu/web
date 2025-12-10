import React, {useState} from "react";
import moment from "moment";
import { getStaticPath } from "../utils/misc/staticPath";
import { estimateReadingTime } from "../utils/misc/readableTime";
import { TranslatableText } from "../reader/TranslatableText";
import ArticleSourceInfo from "../components/ArticleSourceInfo";
import ReadingCompletionProgress from "./ReadingCompletionProgress";
import * as s from "./ArticlePreviewList.sc";
import extractDomain from "../utils/web/extractDomain";
import SaveArticleButton from "./SaveArticleButton";
import ActionButton from "../components/ActionButton";

export default function ArticlePreviewList ({
    article,
    interactiveTitle,
    interactiveSummary,
    isArticleSaved,
    setIsArticleSaved,
    dontShowPublishingTime,
    dontShowSourceIcon,
    titleLink,
    handleHideArticle,
    }) {
    const [isHidden, setIsHidden] = useState(article.hidden || false);
    const [isAnimatingOut, setIsAnimatingOut] = useState(false);

    const handleHideClick = () => {
        setIsAnimatingOut(true);
        setIsHidden(true);
        handleHideArticle();
    }

    if (isHidden){
        return null;
    }

    return (
        <s.ArticlePreview
            style={{
                maxHeight: isAnimatingOut ? '0' : '1000px',
                opacity: isAnimatingOut ? '0' : '1',
                overflow: 'hidden',
                transition: 'max-height 0.3s ease-out, opacity 0.3s ease-out',
                marginBottom: isAnimatingOut ? '0' : undefined,
            }}
        >
            {article.feed_id ? (
                <ArticleSourceInfo
                    articleInfo={article}
                    dontShowPublishingTime={dontShowPublishingTime}
                    dontShowSourceIcon={dontShowSourceIcon}
                />
            ) : (
                !dontShowSourceIcon &&
                article.url && (
                    <s.UrlSourceContainer>
                        <s.UrlSource>{extractDomain(article.url)}</s.UrlSource>
                        {!dontShowPublishingTime && article.published && (
                            <span style={{ marginLeft: "5px" }}>({moment.utc(article.published).fromNow()})</span>
                        )}
                    </s.UrlSourceContainer>
                )
            )}

            <s.TitleContainer>
                <s.Title>
                    {interactiveTitle ? (
                        <TranslatableText interactiveText={interactiveTitle} translating={true} pronouncing={true} />
                    ) : (
                        article.title
                    )}
                </s.Title>
                <ReadingCompletionProgress last_reading_percentage={article.reading_completion}></ReadingCompletionProgress>
            </s.TitleContainer>

            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginTop: "15px",
                    marginBottom: "10px",
                }}
            >
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    {/* Difficulty (CEFR level) */}
                    <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                        <img
                            src={getStaticPath(
                                "icons",
                                `${article.metrics?.cefr_level || article.cefr_level || "B1"}-level-icon.png`,
                            )}
                            alt="difficulty icon"
                            style={{ width: "16px", height: "16px" }}
                        />
                        <span>{article.metrics?.cefr_level || article.cefr_level || "B1"}</span>
                    </div>

                    {/* Simplified label if available */}
                    {article.parent_article_id && <s.SimplifiedLabel>simplified</s.SimplifiedLabel>}
                </div>

                <div>
                    {/* Reading time only */}
                    <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                        <img
                            src={getStaticPath("icons", "read-time-icon.png")}
                            alt="read time icon"
                            style={{ width: "16px", height: "16px" }}
                        />
                        <span>~ {estimateReadingTime(article.metrics?.word_count || article.word_count || 0)}</span>
                    </div>
                </div>
            </div>

            <s.ArticleContent>
                {article.img_url && <img alt="" src={article.img_url} />}
                <s.Summary style={{ display: "flex", flexWrap: "wrap", alignItems: "baseline", gap: "4px" }}>
          <span style={{ flex: "1", minWidth: "fit-content" }}>
            {interactiveSummary ? (
                <TranslatableText interactiveText={interactiveSummary} translating={true} pronouncing={true} />
            ) : (
                article.summary
            )}
          </span>
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            marginTop: "8px",
                            width: "100%",
                        }}
                    >
                        <div style={{ display: "flex", alignItems: "center", gap: "10px", flex: "0 0 auto" }}>
                            {titleLink(article)}
                            <SaveArticleButton
                                article={article}
                                isArticleSaved={isArticleSaved}
                                setIsArticleSaved={setIsArticleSaved}
                            />
                        </div>
                        <div style={{ flex: "0 0 auto" }}>
                            <ActionButton
                                onClick={handleHideClick}
                                variant="muted"
                            >
                                Hide
                            </ActionButton>
                        </div>
                    </div>
                </s.Summary>
            </s.ArticleContent>
        </s.ArticlePreview>
    );
}