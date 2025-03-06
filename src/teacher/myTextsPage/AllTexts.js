import React, { useState, Fragment, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import TeacherTextPreview from "./TeacherTextPreview";
import LoadingAnimation from "../../components/LoadingAnimation";
import { setTitle } from "../../assorted/setTitle";
import strings from "../../i18n/definitions";
import {
  StyledButton,
  TopButtonWrapper,
} from "../styledComponents/TeacherButtons.sc";
import * as s from "../../components/ColumnWidth.sc";
import * as m from "../styledComponents/AllTexts.sc";
import SortingButtons from "../../articles/SortingButtons";
import { PageTitle } from "../../components/PageTitle";
import { APIContext } from "../../contexts/APIContext";

export default function AllTexts() {
  const api = useContext(APIContext);
  const [articleList, setArticleList] = useState(null);
  const [originalList, setOriginalList] = useState(null);
  setTitle(strings.myTexts);

  useEffect(() => {
    api.getTeacherTexts((articles) => {
      setArticleList(articles);
      setOriginalList(articles);
    });
    // eslint-disable-next-line
  }, []);

  if (articleList === null) {
    return <LoadingAnimation />;
  }

  return (
    <Fragment>
      <PageTitle>{strings.myTexts}</PageTitle>

      <s.WideColumn>
        <m.StyledMyTexts>
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
