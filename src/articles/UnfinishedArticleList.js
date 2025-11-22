import React, { useContext } from "react";

import { APIContext } from "../contexts/APIContext";
import * as s from "./UnfinishedArticleList.sc";
import UnfinishedArticlePreview from "./UnfinishedArticlePreview";

export default function UnfinishedArticlesList({
  unfinishedArticles,
}) {
  const api = useContext(APIContext);
  const [unfinishedArticleList, setUnfinishedArticleList] = useState([]);

    useEffect(() => {
        let isMounted = true;

        api.getUnfinishedUserReadingSessions((articles) => {
            if (!isMounted) return;

            setUnfinishedArticleList(articles);

            // Remove unfinished articles from main list
            const filteredList = articleList.filter(
                (article) => !articles.some((a) => a.id === article.id)
            );
            setArticleList(filteredList);
        });

        return () => {
            isMounted = false;
        };
    }, []);

    if (unfinishedArticleList.length === 0) return null;

  return (
    <>
      <s.UnfinishedArticlesBox>
        <s.UnfishedArticleBoxTitle>
          Continue where you left off
        </s.UnfishedArticleBoxTitle>
        {unfinishedArticleList.map((each, index) => (
          <UnfinishedArticlePreview
            key={each.id}
            article={each}
            onArticleClick={() => {
              api.logUserActivity(api.CLICKED_RESUME_ARTICLE, each.id, "", "");
            }}
          />
        ))}
      </s.UnfinishedArticlesBox>
    </>
  );
}
