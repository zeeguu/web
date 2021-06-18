import React, { useState } from "react";
import {
    AccordionItem,
    AccordionButton,
    AccordionPanel,
} from "@reach/accordion";
import * as s from "./ReadingInsightAccordion.sc";
import StudentTranslations from "./StudentTranslations";
import ArticleCard from "./ArticleCard";


const ReadingInsightAccordionItem = ({ isFirst, article }) => {
    const [openedArticle, setOpenedArticle] = useState(null);

    const handleClick = (articleID) => {
        if (articleID === openedArticle) {
            setOpenedArticle(null);
        } else {
            setOpenedArticle(articleID);
        }
    };

    return (
        <s.ReadingInsightAccordion isFirst={isFirst}>
            <AccordionItem
                className="accordion-wrapper"
            >
                <AccordionButton onClick={() => handleClick(article.article_id)}>
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