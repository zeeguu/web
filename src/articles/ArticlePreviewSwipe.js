import { useState, useRef, useEffect } from "react";
import * as s from "./ArticlePreviewSwipe.cs.js";
import { estimateReadingTime } from "../utils/misc/readableTime";
import { getStaticPath } from "../utils/misc/staticPath";
import { TranslatableText } from "../reader/TranslatableText";
import { AnimatePresence, useMotionValue, animate } from "framer-motion";

export default function ArticlePreviewSwipe({
                                                article,
                                                interactiveSummary,
                                                interactiveTitle,
                                                onSwipeLeft,
                                                onSwipeRight,
                                            }) {
    const [isRemoved, setIsRemoved] = useState(false);
    const x = useMotionValue(0);
    const dragStartX = useRef(0);
    const dragStartY = useRef(0);
    const isHorizontalDrag = useRef(false);

    const handleDragStart = (e, info) => {
        dragStartX.current = info.point.x;
        dragStartY.current = info.point.y;
        isHorizontalDrag.current = false;
    };

    const handleDrag = (e, info) => {
        const deltaX = Math.abs(info.point.x - dragStartX.current);
        const deltaY = Math.abs(info.point.y - dragStartY.current);

        // Only consider drag horizontal if X movement is clearly larger than Y
        isHorizontalDrag.current = deltaX > deltaY * 1.5;
    };

    const MIN_DISTANCE = 60;

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
                    <s.ImageWrapper>
                        {article.img_url && <img alt="" src={article.img_url} />}
                        <s.ReadTimeWrapper>
                            <img
                                src={getStaticPath("icons", "read-time-icon.png")}
                                alt="read time icon"
                            />
                            {estimateReadingTime(
                                article.metrics?.word_count || article.word_count || 0
                            )}
                        </s.ReadTimeWrapper>
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
                    </s.Content>
                </s.CardContainer>
            )}
        </AnimatePresence>
    );
}
