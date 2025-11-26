import React, { useState, useRef, useEffect } from "react";
import * as s from "./ArticlePreviewSwipe.sc.js";
import { SimplifiedLabel } from "./ArticlePreviewList.sc.js";
import { estimateReadingTime } from "../utils/misc/readableTime";
import { getStaticPath } from "../utils/misc/staticPath";
import { TranslatableText } from "../reader/TranslatableText";
import { AnimatePresence, useMotionValue, animate } from "framer-motion";
import ArticleSourceInfo from "../components/ArticleSourceInfo";
import SwipeSummaryOverlay from "./SwipeSummaryOverlay.sc";
import Button from "../pages/_pages_shared/Button.sc";
import strings from "../i18n/definitions";
import {SummaryButtonContainer} from "./ArticlePreviewSwipe.sc.js";

export default function ArticlePreviewSwipe({
                                                article,
                                                interactiveSummary,
                                                interactiveTitle,
                                                onSwipeLeft,
                                                onSwipeRight,
                                                onOpen,
                                            }) {
    const [isRemoved, setIsRemoved] = useState(false);
    const x = useMotionValue(0);
    const dragStartX = useRef(0);
    const dragStartY = useRef(0);
    const isHorizontalDrag = useRef(false);

    const [summaryOpen, setSummaryOpen] = useState(false);
    const isPhone = typeof window !== "undefined" &&
        window.matchMedia("(max-width: 768px)").matches;

    const handleDragStart = (e, info) => {
        dragStartX.current = info.point.x;
        dragStartY.current = info.point.y;
        isHorizontalDrag.current = false;
    };

    const handleDrag = (e, info) => {
        const deltaX = Math.abs(info.point.x - dragStartX.current);
        const deltaY = Math.abs(info.point.y - dragStartY.current);

        // Only consider drag horizontal if X movement is clearly larger than Y
        isHorizontalDrag.current = deltaX > deltaY * 0.6;
    };

    const MIN_DISTANCE = 10;

    const handleDragEnd = (_, info) => {
        if (!isHorizontalDrag.current) {
            animate(x, 0, { type: "spring", stiffness: 300 });
            return;
        }

        const deltaX = info.point.x - dragStartX.current;
        const velocityX = info.velocity.x;

        // Only trigger swipe if distance threshold is met
        if (deltaX > MIN_DISTANCE && velocityX > 0) {
            animate(x, 1000, { type: "tween", duration: 0.3, onComplete: () => {
                    setIsRemoved(true);
                    onSwipeRight?.(article);
                }});
        } else if (deltaX < -MIN_DISTANCE && velocityX < 0) {
            animate(x, -1000, { type: "tween", duration: 0.3, onComplete: () => {
                    setIsRemoved(true);
                    onSwipeLeft?.(article);
                }});
        } else {
            // not enough distance → snap back
            animate(x, 0, { type: "spring", stiffness: 300 });
        }
    };

    // Disable scroll when component mounts
    useEffect(() => {
        document.body.style.overflow = 'hidden';

        return () => {
            document.body.style.overflow = '';
        };
    }, []);

    const titleComponent = (
        <s.Title>
            {interactiveTitle ? (
                <TranslatableText
                    interactiveText={interactiveTitle}
                    translating={true}
                    pronouncing={true}
                />
            ) : (
                article.title
            )}
        </s.Title>
    );

    const summary = (
        interactiveSummary ? (
            <TranslatableText
                interactiveText={interactiveSummary}
                translating
                pronouncing
            />
        ) : (
            article.summary
        )
    );


    return (
        <AnimatePresence>
            {!isRemoved && (
                <s.CardContainer
                    drag="x"
                    style={{ x }}
                    dragElastic={0.3}
                    dragConstraints={{ left: 0, right: 0 }}
                    onDragStart={handleDragStart}
                    onDrag={handleDrag}
                    onDragEnd={handleDragEnd}
                    whileTap={{ scale: 0.97 }}>
                    {summaryOpen && (
                        <SwipeSummaryOverlay
                            titleComponent={titleComponent}
                            summary={summary}
                            onClose={(e) => {
                                e.stopPropagation(); // prevent click → swipe
                                setSummaryOpen(false);
                            }}
                        />
                    )}
                    <s.ImageWrapper>
                        {article.img_url && (
                            <img
                                alt=""
                                src={article.img_url}
                                className="link"
                                onClick={() => {
                                    onOpen?.(article);
                                }}
                            />
                        )}
                    </s.ImageWrapper>
                    <s.Content>
                        {titleComponent}
                        {!isPhone && (
                            <s.Summary><span style={{ flex: "1", minWidth: "fit-content" }}>
                                {summary}
                            </span></s.Summary>
                        )}
                        <s.InfoWrapper>
                            <s.InfoItem>
                                <ArticleSourceInfo
                                    articleInfo={article}
                                    style={{ margin: "0 0 0 0", fontSize: "12px" }}
                                />
                            </s.InfoItem>
                            <s.InfoItem>
                                <img
                                    src={getStaticPath("icons", "read-time-icon.png")}
                                    alt="read time icon"
                                />
                                {estimateReadingTime(
                                    article.metrics?.word_count || article.word_count || 0
                                )}
                            </s.InfoItem>
                            <s.InfoItem>
                                <img
                                    src={getStaticPath(
                                        "icons",
                                        `${article.metrics?.cefr_level || article.cefr_level || "B1"}-level-icon.png`
                                    )}
                                    alt="difficulty icon"
                                />
                                <span>{article.metrics?.cefr_level || article.cefr_level || "B1"}</span>
                                {article.parent_article_id && <SimplifiedLabel>simplified</SimplifiedLabel>}
                            </s.InfoItem>
                        </s.InfoWrapper>
                        {isPhone && !summaryOpen && (
                            <SummaryButtonContainer>
                                <Button
                                    className={"show-summary-btn"}
                                    onClick={() => setSummaryOpen(true)}
                                >
                                    {strings.showSummary}
                                </Button>
                            </SummaryButtonContainer>
                        )}
                    </s.Content>
                </s.CardContainer>
            )}
        </AnimatePresence>
    );
}
