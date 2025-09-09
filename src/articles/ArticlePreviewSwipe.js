import React from "react";
import * as s from "./ArticlePreviewSwipe.cs.js";
import {estimateReadingTime} from "../utils/misc/readableTime";
import extractDomain from "../utils/web/extractDomain";
import {getStaticPath} from "../utils/misc/staticPath";
import {TranslatableText} from "../reader/TranslatableText";

export default function ArticlePreviewSwipe({ article, titleLink, interactiveSummary, interactiveTitle }) {

    return (
        <s.CardContainer>
            <s.ImageWrapper>
                {article.img_url && <img alt="" src={article.img_url} />}
                <s.ReadTimeWrapper>
                    <img src={getStaticPath("icons", "read-time-icon.png")} alt="read time icon"/>
                    {estimateReadingTime(article.metrics?.word_count || article.word_count || 0)}
                </s.ReadTimeWrapper>
                <s.LangTag>{article.language.toUpperCase()}</s.LangTag>
            </s.ImageWrapper>

            <s.Content>

                <s.Title>{interactiveTitle ? (
                    <TranslatableText interactiveText={interactiveTitle} translating={true} pronouncing={true} />
                ) : (
                    article.title
                )}</s.Title>
                <s.Summary><span style={{ flex: "1", minWidth: "fit-content" }}>
                {interactiveSummary ? (
                    <TranslatableText interactiveText={interactiveSummary} translating={true} pronouncing={true} />
                ) : (
                    article.summary
                )}
              </span></s.Summary>
                <s.ContinueReading>
                    {titleLink(article)}
                </s.ContinueReading>
            </s.Content>

            <s.Footer>
                from{" "}
                {article.feed_id ? (
                        <span>{article.feed_name || article.feed_icon_name?.replace(/\.[^.]+$/, "") }</span>
                ) : (
                    article.url && <span>{extractDomain(article.url)}</span>
                )}
            </s.Footer>
        </s.CardContainer>
    );
}
