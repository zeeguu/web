import React, { useState, Fragment } from "react";
import { Link } from "react-router-dom";
import TeacherTextPreview from "./TeacherTextPreview";
import LoadingAnimation from "../components/LoadingAnimation";
import { setTitle } from "../assorted/setTitle";
import strings from "../i18n/definitions";
import { StyledButton, TopButtonWrapper, TopButtonWrapperWrapper } from "./TeacherButtons.sc";
import * as s from "../components/ColumnWidth.sc";
import * as sc from "../components/TopTabs.sc";
import * as m from "./AllTexts.sc";

import { DUMMYLIST } from "./DummyArticleList";
import SortingButtons from "../articles/SortingButtons";

export default function AllTexts({ api }) {

  const [articleList, setArticleList] = useState(null);
  var originalList = null;
  
  //on initial render
  if (articleList == null) {
    //TODO here should be an api call to get ALL the teachers texts...
      setArticleList(DUMMYLIST);
      originalList = [...DUMMYLIST];
    

    setTitle("Add Texts STRINGS");

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
            <StyledButton primary>STRINGSAdd text</StyledButton>
          </TopButtonWrapper>
        </Link>
        <br/>
        <br/>
        <m.StyledMyTexts>
        <div className="my-text-box">
        <SortingButtons
        articleList={articleList}
        originalList={originalList}
        setArticleList={setArticleList}
        />
        </div>
        </m.StyledMyTexts>
        {articleList.map((each) => (
          <TeacherTextPreview
            key={each.id}
            article={each}
            api={api}
          />
          
        ))}
        <br />
        </m.StyledMyTexts>
      </s.WideColumn>
    </Fragment>
  );
}
