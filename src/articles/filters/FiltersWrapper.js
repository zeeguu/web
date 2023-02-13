import React, { useEffect, useRef, useState } from "react";

import { Filters } from "../../components/icons/Filters";
import * as s from "./FiltersWrapper.sc";
import strings from "../../i18n/definitions";

export const FiltersWrapper = ({ children }) => {
  const blockRef = useRef();
  const filtersRef = useRef();

  const [isOpen, setIsOpen] = useState(false);
  const [currentFilter, setCurrentFilter] = useState("");
  const [blockHeight, setBlockHeight] = useState(0);

  useEffect(() => {
    if (blockRef?.current?.clientHeight)
      setBlockHeight(blockRef?.current?.clientHeight + 10);
  }, [blockRef, blockRef?.current?.clientHeight]);

  return (
    <s.FiltersWrapperContainer
      style={{
        height: blockRef ? `${blockHeight}px` : "100%",
      }}
    >
      <s.FiltersButtonBox onClick={() => setIsOpen(!isOpen)}>
        <Filters />
        <span>{strings.filters}</span>
      </s.FiltersButtonBox>

      <s.FiltersWrapperBox
        ref={blockRef}
        style={{
          transition: "all 400ms ease-in-out 0s",
          top: isOpen ? "10px" : `-${filtersRef?.current?.clientHeight + 10}px`,
        }}
      >
        <s.Filters ref={filtersRef}>
          <s.FilterColumn>
            <s.Title>date</s.Title>
            <s.Filter className="selected">For the last hour</s.Filter>
            <s.Filter>Today</s.Filter>
            <s.Filter>For this week</s.Filter>
            <s.Filter>For this month</s.Filter>
            <s.Filter>For this year</s.Filter>
          </s.FilterColumn>
          <s.FilterColumn>
            <s.Title>type</s.Title>
            <s.Filter>Video</s.Filter>
            <s.Filter>Text</s.Filter>
          </s.FilterColumn>
          <s.FilterColumn>
            <s.Title>duration</s.Title>
            <s.Filter>Under 4 minutes</s.Filter>
            <s.Filter>4-20 minutes</s.Filter>
            <s.Filter>Over 20 minutes</s.Filter>
          </s.FilterColumn>
          <s.FilterColumn>
            <s.Title>Level</s.Title>
            <s.Filter>Easy</s.Filter>
            <s.Filter>Fair</s.Filter>
            <s.Filter>Challenging</s.Filter>
          </s.FilterColumn>
          <s.FilterColumn>
            <s.Title>sort by</s.Title>
            <s.Filter>By relevance</s.Filter>
            <s.Filter>By date</s.Filter>
            <s.Filter>By length</s.Filter>
            <s.Filter>By level</s.Filter>
          </s.FilterColumn>
        </s.Filters>
        <div style={{ display: "flex", flexDirection: "column" }}>
          {children}
        </div>
      </s.FiltersWrapperBox>
    </s.FiltersWrapperContainer>
  );
};
