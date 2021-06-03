import React, { useState, Fragment } from "react";
import { Link } from "react-router-dom";
import TeacherTextPreview from "./TeacherTextPreview";
import LoadingAnimation from "../components/LoadingAnimation";
import { setTitle } from "../assorted/setTitle";
import strings from "../i18n/definitions";
import { StyledButton, TopButtonWrapper } from "./TeacherButtons.sc";
import * as s from "../components/ColumnWidth.sc";
import * as sc from "../components/TopTabs.sc";
import * as m from "./AllTexts.sc";
import SortingButtons from "../articles/SortingButtons";

export default function AllTexts({ api }) {
  const [articleList, setArticleList] = useState(null);
  const [originalList, setOriginalList] = useState(null);

  //on initial render
  if (articleList == null) {
    api.getTeacherTexts((articles) => {
      //making sure the newest articles are on top
      const reversedList = articles.reverse();
      setArticleList(reversedList);
      setOriginalList(reversedList);
    });

    setTitle(strings.addTexts);

    return <LoadingAnimation />;
  }

  return (
    <Fragment>
      <s.WideColumn>
        <m.StyledMyTexts>
          <sc.TopTabs>
            <h1>{strings.myTexts}</h1>
          </sc.TopTabs>
          <Link to="/teacher/texts/AddTextOptions">
            <TopButtonWrapper>
              <StyledButton primary>{strings.addText}</StyledButton>
            </TopButtonWrapper>
          </Link>
          <br />
          <br />
          {articleList.length > 0 ? (
            <div className="sorting-btns-box">
              <SortingButtons
                articleList={articleList}
                originalList={originalList}
                setArticleList={setArticleList}
              />
            </div>
          ) : (
            <s.CenteredContent>
              <h4>{strings.noTextAddedYet}</h4>
            </s.CenteredContent>
          )}
          {articleList.map((each) => (
            <TeacherTextPreview key={each.id} article={each} />
          ))}
          <br />
        </m.StyledMyTexts>
      </s.WideColumn>
    </Fragment>
  );
}
