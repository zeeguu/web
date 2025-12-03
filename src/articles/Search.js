import { useState } from "react";
import * as s from "./Search.sc";
import useQuery from "../hooks/useQuery";
import SubscribeSearchButton from "./SubscribeSearchButton";
import ArticleListBrowser from "./ArticleListBrowser";
import CustomizeSearchToolbar from "./CustomizeSearchToolbar";

export default function Search() {
  const searchQuery = useQuery().get("search");
  const [searchPublishPriority, setSearchPublishPriority] = useState(true);
  const [searchDifficultyPriority, setSearchDifficultyPriority] = useState(true);

  return (
    <ArticleListBrowser
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
            {!searchQuery && (
              <s.SearchNote>
                Your saved searches are also used to personalize the recommendations on your homepage.
              </s.SearchNote>
            )}
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
