import React, { useState, Fragment, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import TeacherTextPreview from "./TeacherTextPreview";
import LoadingAnimation from "../../components/LoadingAnimation";
import { setTitle } from "../../assorted/setTitle";
import strings from "../../i18n/definitions";
import { StyledButton } from "../styledComponents/TeacherButtons.sc";
import * as s from "../../components/ColumnWidth.sc";
import * as m from "../styledComponents/AllTexts.sc";
import * as h from "../styledComponents/MyTextsHeader.sc";
import { TeacherPageHeading, TeacherPageSubtitle } from "../styledComponents/TeacherPageHeading.sc";
import SortingButtons from "../../articles/SortingButtons";
import { APIContext } from "../../contexts/APIContext";
import { ALL, buildClassFilters, filterTexts } from "./textFilters";

export default function AllTexts() {
  const api = useContext(APIContext);
  const [articleList, setArticleList] = useState(null);
  const [originalList, setOriginalList] = useState(null);
  const [activeFilter, setActiveFilter] = useState(ALL);
  setTitle(strings.myTexts);

  useEffect(() => {
    api.getTeacherTexts((articles) => {
      setArticleList(articles);
      setOriginalList(articles);
    });
    // eslint-disable-next-line
  }, []);

  // Sharing a text from its row changes which chips it belongs under, so the
  // list has to hold the new value rather than wait for a reload.
  function handleSharingChanged(articleID, sharedWith) {
    const apply = (list) =>
      list.map((each) => (each.id === articleID ? { ...each, shared_with: sharedWith } : each));
    setArticleList(apply);
    setOriginalList(apply);
  }

  if (articleList === null) {
    return <LoadingAnimation />;
  }

  const filters = buildClassFilters(articleList);
  const visibleTexts = filterTexts(articleList, activeFilter);
  const notSharedCount = filters.find((each) => each.id === "not-shared")?.count || 0;

  return (
    <Fragment>
      <s.NarrowColumn>
        <m.StyledMyTexts>
          <h.Header>
            <div>
              <TeacherPageHeading>{strings.myTexts}</TeacherPageHeading>
              <TeacherPageSubtitle>
                {articleList.length} {articleList.length === 1 ? "text" : "texts"}
                {notSharedCount > 0 && ` · ${notSharedCount} shared with nobody`}
              </TeacherPageSubtitle>
            </div>
            <Link to="/teacher/texts/AddTextOptions">
              <StyledButton $primary>{strings.addText}</StyledButton>
            </Link>
          </h.Header>

          {articleList.length === 0 ? (
            <s.CenteredContent>
              <h4>{strings.noTextAddedYet}</h4>
            </s.CenteredContent>
          ) : (
            <h.FilterBar>
              {filters.map((filter) => (
                <h.Chip
                  key={filter.id}
                  type="button"
                  $on={activeFilter === filter.id}
                  $dashed={filter.dashed}
                  aria-pressed={activeFilter === filter.id}
                  onClick={() => setActiveFilter(filter.id)}
                >
                  {filter.name}
                  <h.ChipCount>{filter.count}</h.ChipCount>
                </h.Chip>
              ))}
              <SortingButtons
                articleList={articleList}
                originalList={originalList}
                setArticleList={setArticleList}
              />
            </h.FilterBar>
          )}

          {visibleTexts.map((each) => (
            <TeacherTextPreview
              key={each.id}
              article={each}
              onSharingChanged={handleSharingChanged}
            />
          ))}
        </m.StyledMyTexts>
      </s.NarrowColumn>
    </Fragment>
  );
}
