import React, { useContext, useState, Fragment } from "react";
import { Link } from "react-router-dom";
import { RoutingContext } from "../contexts/RoutingContext";
import TeacherTextPreview from "./TeacherTextPreview";
import LoadingAnimation from "../components/LoadingAnimation";
import { setTitle } from "../assorted/setTitle";
import strings from "../i18n/definitions";
import { StyledButton, TopButton } from "./TeacherButtons.sc";
import * as s from "../components/ColumnWidth.sc";
import * as sc from "../components/TopTabs.sc";

import { DUMMYLIST } from "./DummyArticleList";
import SortingButtons from "../articles/SortingButtons";

export default function AllTexts({ api }) {
  //Setting up the routing context to be able to route correctly on Cancel
  const { setReturnPath } = useContext(RoutingContext);
  // eslint-disable-next-line;

  const [articleList, setArticleList] = useState(null);
  var originalList = null;
  
  //on initial render
  if (articleList == null) {
    //TODO here should be an api call to get ALL the teachers texts...
      setArticleList(DUMMYLIST);
      originalList = [...DUMMYLIST];
    

    setTitle("Find Articles");

    return <LoadingAnimation />;
  }
  return (
    <Fragment>
      <s.WideColumn>
        <sc.TopTabs>
          <h1>{strings.myTexts}</h1>
        </sc.TopTabs>
        <Link to="/teacher/texts/AddTextOptions">
          <TopButton>
            <StyledButton primary>STRINGSAdd text</StyledButton>
          </TopButton>
        </Link>
        <br/>
        <br/>
        <div style={{margin: "0", width: "80%",display: "flex", justifyContent:"space-between" }}>
         <p>(STRINGS) title of your text</p> 
        <SortingButtons
        articleList={articleList}
        originalList={originalList}
        setArticleList={setArticleList}
      />
      </div>
        
        {articleList.map((each) => (
          <TeacherTextPreview
            key={each.id}
            article={each}
            api={api}
            setReturnPath={setReturnPath}
          />
        ))}
        <br />
      </s.WideColumn>
    </Fragment>
  );
}
