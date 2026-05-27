import styled from "styled-components";

// Row layout for the My Articles list: the entire row is the open
// affordance (tap anywhere → reader). Thumbnail on the left, title +
// MetaStrip on the right, small × in the top-right corner to remove.
const Row = styled.div`
  position: relative;
  display: flex;
  align-items: stretch;
  padding: 0.6em 0.8em;
  gap: 0.8em;
  outline: none;
  margin-bottom: 1.5em;
  &:active { background: var(--row-active-bg, rgba(255, 255, 255, 0.04)); }
`;

const ThumbnailWrap = styled.div`
  flex-shrink: 0;
  width: 6.5em;
  height: 6.5em;
  border-radius: 0.6em;
  overflow: hidden;
`;

const Thumbnail = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
`;

// Stand-in for articles with no image: fills the same 6.5em square as a
// real thumbnail so titles stay aligned in one column. A vague,
// topic-matched glyph (see topicIcon.js) on a muted surface — deliberately
// understated so it reads as "no photo" rather than competing with the title.
const Placeholder = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--bg-tertiary);
  color: var(--text-faint);
`;

const Content = styled.div`
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 0.35em;
  padding-right: 1.4em; /* leave room for the × button */
`;

const Title = styled.div`
  font-size: 1.05em;
  font-weight: 600;
  color: var(--text-primary);
  line-height: 1.3;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

// Completion indicators in the meta strip. In-progress uses amber so
// the eye lands on "you left off here"; done uses green for positive
// closure. Both sit as siblings of MetaItem/MetaTag and participate
// in the `·` separator pattern via the strip's selector.
const CompletionInProgress = styled.span`
  color: #f59e0b;
  font-weight: 500;
`;

const CompletionDone = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  color: #16a34a;
  font-weight: 500;
`;

const RemoveButton = styled.button`
  position: absolute;
  right: 0.4em;
  width: 1.6em;
  height: 1.6em;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  
  border: none;
  color: var(--text-muted);
  font-size: 1.3em;
  line-height: 1;
  cursor: pointer;
  padding: 0;
  &:active { color: var(--text-primary); }
`;

export {
  Row,
  ThumbnailWrap,
  Thumbnail,
  Placeholder,
  Content,
  Title,
  CompletionInProgress,
  CompletionDone,
  RemoveButton,
};
