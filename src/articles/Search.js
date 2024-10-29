import React, { useState } from "react";
import * as s from "./Search.sc";
import useQuery from "../hooks/useQuery";
import SubscribeSearchButton from "./SubscribeSearchButton";
import FindArticles from "./FindArticles";
import CustomizeSearchToolbar from "./CustomizeSearchToolbar";

export default function Search({ api }) {
  const searchQuery = useQuery().get("search");
  const [searchPublishPriority, setSearchPublishPriority] = useState(false);
  const [searchDifficultyPriority, setSearchDifficultyPriority] =
    useState(true);

  return (
    <FindArticles
      searchPublishPriority={searchPublishPriority}
      searchDifficultyPriority={searchDifficultyPriority}
      searchQuery={searchQuery}
      content={
        <s.SearchTopBar>
          <s.ContainerTitleSubscribe>
            <s.RowHeadlineSearch>
              <s.ContainerH1Subscribe>
                <s.HeadlineSearch>{searchQuery}</s.HeadlineSearch>
              </s.ContainerH1Subscribe>
            </s.RowHeadlineSearch>
            <SubscribeSearchButton api={api} query={searchQuery} />
          </s.ContainerTitleSubscribe>
          <CustomizeSearchToolbar
            searchPublishPriority={searchPublishPriority}
            setSearchPublishPriority={setSearchPublishPriority}
            searchDifficultyPriority={searchDifficultyPriority}
            setSearchDifficultyPriority={setSearchDifficultyPriority}
          />
        </s.SearchTopBar>
      }
    />
  );
}
