import React, { useState } from "react";
import {
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
} from "@reach/accordion";
import * as s from "./ReadingInsightAccordion.sc";
import ViewMoreLessButton from "./ViewMoreLessButton";
import StudentActivityDataCircles from "./StudentActivityDataCircles";
import StudentTranslations from "./StudentTranslations";

const ReadingInsightAccordion = ({ readArticles }) => {
  const [openedArticle, setOpenedArticle] = useState(null);
  
  const handleClick =(articleID) =>{
    if (articleID===openedArticle){
      setOpenedArticle(null)
    }else{
      setOpenedArticle(articleID)
    }
  }

  return (
    <s.ReadingInsightAccordion>
      <Accordion collapsible>
        {(readArticles !==null) &&
          readArticles.map((article) => (
            <AccordionItem key={article.article_id} className="accordion-wrapper">
              <AccordionButton onClick={()=>handleClick(article.article_id)}>
                <div className="content-wrapper">
                  <h2 className="article-title">
                    {article.title.substring(0, 100)}
                    {article.title.length > 100 ? "..." : ""}
                  </h2>
                  <div className="data-circle-wrapper">
                    <StudentActivityDataCircles
                      className="data-circles"
                      length={article.word_count}
                      difficulty={article.difficulty}
                      readingTime={article.duration_in_sec}
                      translatedWords={article.translations.length}
                    />
                    <ViewMoreLessButton articleID={article.article_id} openedArticle={openedArticle}/>
                  </div>
                </div>
              </AccordionButton>
              <AccordionPanel className="panel">
                <StudentTranslations article={article}/>
              </AccordionPanel>
            </AccordionItem>
          ))}
      </Accordion>
    </s.ReadingInsightAccordion>
  );
};
export default ReadingInsightAccordion;
