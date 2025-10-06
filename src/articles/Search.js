import { useState } from "react";
import * as s from "./Search.sc";
import useQuery from "../hooks/useQuery";
import SubscribeSearchButton from "./SubscribeSearchButton";
import ArticleListBrowser from "./ArticleListBrowser";
import CustomizeSearchToolbar from "./CustomizeSearchToolbar";

export default function Search({ hasExtension, isChrome }) {
  const searchQuery = useQuery().get("search");
  const [searchPublishPriority, setSearchPublishPriority] = useState(false);
  const [searchDifficultyPriority, setSearchDifficultyPriority] = useState(true);

  return (
    <ArticleListBrowser
      hasExtension={hasExtension}
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
            <SubscribeSearchButton query={searchQuery} />
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
