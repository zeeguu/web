import React, { useEffect, useRef, useState } from "react";

import { Filters } from "../../components/icons/Filters";
import * as s from "./FiltersWrapper.sc";
import strings from "../../i18n/definitions";
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
  const [blockHeight, setBlockHeight] = useState(500);
  const [isOpen, setIsOpen] = useState(false);

  const [currentFiltersData, setCurrentFiltersData] = useState(filtersData);
  const [filters, setFilters] = useState({
    date: null,
    type: null,
    duration: null,
    level: null,
    sortBy: null,
  });

  useEffect(() => {
    if (blockRef?.current?.clientHeight && isLargerThan768) {
      if (blockRef?.current?.clientHeight + 20 > 400) {
        setBlockHeight(blockRef?.current?.clientHeight + 20);
      }
    }
  }, [
    blockRef,
    blockRef?.current?.clientHeight,
    filters,
    setArticles,
    children,
    isLargerThan768,
  ]);

  const handleSetFilter = (id, value) => {
    let newFilters = Object.assign({}, filters);

    if (filters[id] === value) {
      // Remove filter value
      newFilters[id] = null;
    } else {
      // Add filter value
      newFilters[id] = value;
    }

    setFilters(newFilters);
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
              {currentFiltersData.map(({ title, id, values }) => (
                <s.FilterColumn key={id}>
                  <s.Title>{title}</s.Title>
                  {values.map((value) => (
                    <s.Filter
                      key={value.type}
                      className={filters[id] === value.type ? "selected" : ""}
                      onClick={() => handleSetFilter(id, value.type)}
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
