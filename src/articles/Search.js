import React, { useState, useEffect } from "react";
import * as s from "./Search.sc";
import useQuery from "../hooks/useQuery";
import SubscribeSearchButton from "./SubscribeSearchButton";
import FindArticles from "./FindArticles";

export default function Search({ api }) {
  const searchQuery = useQuery().get("search");

  return (
    <FindArticles
      searchQuery={searchQuery}
      contentSearch={
        <>
          <s.RowHeadlineSearch>
            <s.ContainerH1Subscribe>
              <s.HeadlineSearch>{searchQuery}</s.HeadlineSearch>
            </s.ContainerH1Subscribe>
          </s.RowHeadlineSearch>
          <SubscribeSearchButton api={api} query={searchQuery} />
        </>
      }
    />
  );
}
