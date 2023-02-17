import React, { useEffect, useState } from "react";
import * as s from "./MobileFilters.sc";
import FiltersClass from "../../utils/filters/filters";
import strings from "../../i18n/definitions";
import { filtersData } from "./FiltersWrapper";

export const MobileFilters = ({ setArticles, isFiltersOpen, onClose }) => {
  const [currentFilter, setCurrentFilter] = useState(
    FiltersClass.getCurrentFilter() || null
  );

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
  }, [currentFilter]);

  const handleSetCurrentFilter = (id, value) => {
    onClose && onClose();

    if (value?.type === currentFilter?.value?.type) {
      setCurrentFilter(null);
      FiltersClass.setCurrentFilter(null);
    } else {
      setCurrentFilter({ id, value });
      FiltersClass.setCurrentFilter({ id, value });
    }
  };

  return (
    <s.MobileFilters style={{ right: isFiltersOpen ? 0 : "-100%" }}>
      <s.FiltersHeader>
        <img src="/static/icons/arrow.svg" alt="arrow" onClick={onClose} />
        <span>{strings.filters}</span>
      </s.FiltersHeader>
      {filtersData.map(({ title, id, values }) => (
        <s.FilterColumn key={id}>
          <s.Title>{title}</s.Title>
          {values.map((value) => (
            <s.Filter
              key={value.type}
              className={
                currentFilter?.value?.type === value?.type ? "selected" : ""
              }
              onClick={() => handleSetCurrentFilter(id, value)}
            >
              {value.name}
            </s.Filter>
          ))}
        </s.FilterColumn>
      ))}
    </s.MobileFilters>
  );
};
