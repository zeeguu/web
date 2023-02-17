import React, { useEffect, useRef, useState } from "react";

import { Filters } from "../../components/icons/Filters";
import * as s from "./FiltersWrapper.sc";
import strings from "../../i18n/definitions";
import FiltersClass from "../../utils/filters/filters";
import { useMediaQuery } from "@mui/material";

export const filtersData = [
  {
    title: "Date",
    id: "date",
    values: [
      { name: "For the last hour", type: "hour" },
      { name: "Today", type: "today" },
      { name: "For this week", type: "week" },
      { name: "For this month", type: "month" },
      { name: "For this year", type: "year" },
    ],
  },
  {
    title: "Type",
    id: "type",
    values: [
      { name: "Video", type: "video" },
      { name: "Text", type: "text" },
    ],
  },
  {
    title: "Duration",
    id: "duration",
    values: [
      { name: "Under 4 minutes", type: "under 4 min" },
      { name: "4-20 minutes", type: "4-20 min" },
      { name: "Over 20 minutes", type: "over 20 min" },
    ],
  },
  {
    title: "Level",
    id: "level",
    values: [
      { name: "Easy", type: "easy" },
      { name: "Fair", type: "fair" },
      { name: "Challenging", type: "challenging" },
    ],
  },
  {
    title: "Sort by",
    id: "sortBy",
    values: [
      { name: "By relevance", type: "relevance" },
      { name: "By date", type: "date" },
      { name: "By length", type: "length" },
      { name: "By level", type: "level" },
    ],
  },
];

export const FiltersWrapper = ({ children, setArticles }) => {
  const blockRef = useRef();
  const filtersRef = useRef();
  const isLargerThan768 = useMediaQuery("(min-width: 768px)");

  const [isOpen, setIsOpen] = useState(false);
  const [currentFilter, setCurrentFilter] = useState(
    FiltersClass.getCurrentFilter() || null
  );
  const [blockHeight, setBlockHeight] = useState(0);

  useEffect(() => {
    if (blockRef?.current?.clientHeight && isLargerThan768) {
      setBlockHeight(blockRef?.current?.clientHeight + 20);
    }
  }, [
    blockRef,
    blockRef?.current?.clientHeight,
    currentFilter,
    setArticles,
    children,
    isLargerThan768,
  ]);

  useEffect(() => {
    if (!FiltersClass.getCurrentFilter()) setCurrentFilter(null);
  }, [FiltersClass.getCurrentFilter()]);

  useEffect(() => {
    if (currentFilter?.id) {
      switch (currentFilter.id) {
        case "date": {
          setArticles(FiltersClass.filterByDate());
          break;
        }
        case "type": {
          setArticles(FiltersClass.filterByType());
          break;
        }
        case "duration": {
          setArticles(FiltersClass.filterByDuration());
          break;
        }
        case "level": {
          setArticles(FiltersClass.filterByLevel());
          break;
        }
        case "sortBy": {
          setArticles(FiltersClass.sortBy());
          break;
        }
      }
    } else {
      setArticles(FiltersClass.getArticlesList());
    }
    setBlockHeight(blockRef?.current?.clientHeight + 20);
  }, [currentFilter]);

  const handleSetCurrentFilter = (id, value) => {
    if (value?.type === currentFilter?.value?.type) {
      setCurrentFilter(null);
      FiltersClass.setCurrentFilter(null);
    } else {
      setCurrentFilter({ id, value });
      FiltersClass.setCurrentFilter({ id, value });
    }
  };

  return (
    <s.FiltersWrapperContainer
      style={{
        height: blockRef && isLargerThan768 ? `${blockHeight}px` : "100%",
      }}
    >
      {isLargerThan768 ? (
        <>
          <s.FiltersButtonBox onClick={() => setIsOpen(!isOpen)}>
            <Filters />
            <span>{strings.filters}</span>
          </s.FiltersButtonBox>

          <s.FiltersWrapperBox
            ref={blockRef}
            style={{
              transition: "all 400ms ease-in-out 0s",
              top: isOpen
                ? "10px"
                : `-${filtersRef?.current?.clientHeight + 10}px`,
            }}
          >
            <s.Filters ref={filtersRef}>
              {filtersData.map(({ title, id, values }) => (
                <s.FilterColumn key={id}>
                  <s.Title>{title}</s.Title>
                  {values.map((value) => (
                    <s.Filter
                      key={value.type}
                      className={
                        currentFilter?.value?.type === value?.type
                          ? "selected"
                          : ""
                      }
                      onClick={() => handleSetCurrentFilter(id, value)}
                    >
                      {value.name}
                    </s.Filter>
                  ))}
                </s.FilterColumn>
              ))}
            </s.Filters>
            <div style={{ display: "flex", flexDirection: "column" }}>
              {children}
            </div>
          </s.FiltersWrapperBox>
        </>
      ) : (
        <div style={{ display: "flex", flexDirection: "column" }}>
          {children}
        </div>
      )}
    </s.FiltersWrapperContainer>
  );
};
