import { useContext, useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import styled from "styled-components";

import { APIContext } from "../contexts/APIContext";
import { UserContext } from "../contexts/UserContext";
import LoadingAnimation from "../components/LoadingAnimation";
import { PageTitle } from "../components/PageTitle";
import { PaddedNarrowColumn } from "../components/ColumnWidth.sc";
import { MetaStrip, MetaItem } from "../components/MetaStrip.sc";
import { articleSourceLabel } from "../utils/misc/articleHelpers";
import { isA0Learner } from "../utils/misc/userCefrLevel";
import ArticleThumbnail from "../articles/ArticleThumbnail";
import ReadingCompletion from "../articles/ReadingCompletion";
import { Kicker } from "../articles/ArticlePreview.sc";
import * as s from "../articles/SavedArticleRow.sc";
import { aikiChoices } from "./aikiChoices";
import { startAikiSession } from "./aikiMinute";

const KIND_IMAGES = { exercises: "/static/images/elephants/dumbbell.png", lesson: "/static/images/elephants/headphones.png" };

// Longest the page waits for a lookup before showing what it has: the
// exercise count has taken minutes on a bad day, and the lesson row needs none.
const LOOKUP_TIMEOUT_MS = 3000;

function withTimeout(promise, fallback) {
  const timeout = new Promise((resolve) => setTimeout(() => resolve(fallback), LOOKUP_TIMEOUT_MS));
  return Promise.race([promise.catch(() => fallback), timeout]);
}

// /aiki: the way into Zeeguu for a learner earning time in Aiki mode. Offers a
// few things worth a minute of learning, as rows styled like saved articles.
export default function AikiPage() {
  const api = useContext(APIContext);
  const { userDetails } = useContext(UserContext);
  const [choices, setChoices] = useState(null);

  useEffect(() => {
    // A failed or slow lookup counts as "nothing there"; the lesson row is always shown.
    Promise.all([
      withTimeout(api.getCountOfUserWordsRecommendedForPracticePromise(), 0),
      withTimeout(
        new Promise((resolve) => api.getTodaysLesson(userDetails?.learned_language, resolve, () => resolve(null))),
        null,
      ),
      withTimeout(api.getUnfinishedArticlesPromise(5), []),
    ]).then(([exercisesDue, lesson, unfinishedArticles]) =>
      setChoices(aikiChoices({ exercisesDue, lesson, unfinishedArticles })),
    );
    // eslint-disable-next-line
  }, []);

  if (!choices) return <LoadingAnimation />;

  return (
    <PaddedNarrowColumn>
      <PageTitle>Earn your minutes</PageTitle>
      <Subtitle>A minute of learning unlocks your paused apps for 5 minutes.</Subtitle>
      {choices.map((choice) => (
        <ChoiceRow key={choice.kind} choice={choice} />
      ))}
      {/* There is no feed at A0 (see NoFeedAtA0). */}
      {!isA0Learner(userDetails) && (
        <FeedLink to="/articles" onClick={startAikiSession}>
          or pick something from your feed
        </FeedLink>
      )}
    </PaddedNarrowColumn>
  );
}

function ChoiceRow({ choice }) {
  const history = useHistory();
  const open = () => {
    startAikiSession();
    history.push(choice.href);
  };
  const onKeyDown = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      open();
    }
  };

  const image = choice.article ? (
    <ArticleThumbnail article={choice.article} />
  ) : (
    <s.ThumbnailWrap>
      <s.Placeholder>
        <Elephant src={KIND_IMAGES[choice.kind]} alt="" />
      </s.Placeholder>
    </s.ThumbnailWrap>
  );
  const meta = choice.article ? <ArticleMeta article={choice.article} /> : <MetaItem>{choice.meta}</MetaItem>;

  return (
    <s.Row style={{ cursor: "pointer" }} onClick={open} onKeyDown={onKeyDown} role="button" tabIndex={0}>
      {image}
      <s.Content>
        {choice.kicker && <Kicker>{choice.kicker}</Kicker>}
        <s.Title>{choice.title}</s.Title>
        <MetaStrip>{meta}</MetaStrip>
      </s.Content>
    </s.Row>
  );
}

function ArticleMeta({ article }) {
  const source = articleSourceLabel(article);
  return (
    <>
      <ReadingCompletion ratio={article.last_reading_percentage} />
      {source && <MetaItem>{source}</MetaItem>}
    </>
  );
}

const Elephant = styled.img`
  width: 80%;
  height: 80%;
  object-fit: contain;
`;

const Subtitle = styled.p`
  text-align: center;
  color: var(--text-secondary);
  margin: 0.5em 0 2em;
`;


const FeedLink = styled(Link)`
  display: block;
  text-align: center;
  color: var(--text-secondary);
  margin: 0.5em 0 2em;
`;
