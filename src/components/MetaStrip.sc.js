import styled from "styled-components";
import { blue400 } from "./colors";

// Quiet metadata strip used under article titles in both the recommendation
// list (ArticlePreview) and the reader header (ArticleStatInfo). Children
// are MetaItem (muted) or MetaTag (accent for state). The strip renders
// `·` separators between consecutive children via ::before so callers
// don't have to thread separator JSX through conditional rendering.
const MetaStrip = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  margin-top: 8px;
  font-size: small;
  column-gap: 0.5em;
  row-gap: 0.2em;

  > * + *::before {
    content: "·";
    margin-right: 0.5em;
    color: var(--text-muted);
  }
`;

const MetaItem = styled.span`
  color: var(--text-muted);
  display: inline-flex;
  align-items: center;
  gap: 4px;
`;

const MetaLink = styled.a`
  color: var(--link-color, ${blue400});
  text-decoration: none;
  &:hover { text-decoration: underline; }

  /* For metadata that happens to be a link (e.g. the article source) but
     isn't navigation — reads as muted info, not an accent-colored action. */
  &.muted {
    color: var(--text-muted);
  }
`;

const MetaTag = styled.span`
  color: var(--badge-text);
  font-weight: 500;
`;

export { MetaStrip, MetaItem, MetaLink, MetaTag };
