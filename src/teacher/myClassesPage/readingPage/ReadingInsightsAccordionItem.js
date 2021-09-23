import React from "react";
import {
    AccordionItem,
    AccordionButton,
    AccordionPanel,
} from "@reach/accordion";
import * as s from "../../styledComponents/ReadingInsightAccordion.sc";
import StudentTranslations from "./StudentTranslations";
import ArticleCard from "./ArticleCard";

const ReadingInsightAccordionItem = ({
    isFirst,
    article,
    setOpenedArticle,
    openedArticle,
}) => {
    const handleClick = (sessionID) => {
        if (sessionID === openedArticle) {
            setOpenedArticle(null);
        } else {
            setOpenedArticle(sessionID);
        }
    };

    return (
        <s.ReadingInsightAccordion isFirst={isFirst}>
            <AccordionItem className="accordion-wrapper">
                <AccordionButton onClick={() => handleClick(article.session_id)}>
                    <ArticleCard
                        isFirst={isFirst}
                        article={article}
                        openedArticle={openedArticle}
                    />
                </AccordionButton>
                <AccordionPanel className="panel">
                    <StudentTranslations article={article} />
                </AccordionPanel>
            </AccordionItem>
        </s.ReadingInsightAccordion>
    );
};
export default ReadingInsightAccordionItem;
