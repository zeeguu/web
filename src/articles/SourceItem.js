import { Fragment } from "react";
import { Link } from "react-router-dom";
import { MetaItem, MetaLink } from "../components/MetaStrip.sc";
import { storyOutlets } from "../utils/misc/articleHelpers";

// Where the card's text comes from, in its meta strip. A story several outlets
// ran lists them all as equals -- no "also in" -- and each opens that outlet's
// article in the reader, so the learner picks whose version to read. Otherwise
// the single source links out to the original, as before.
export default function SourceItem({ article, sourceLabel }) {
  const outlets = storyOutlets(article);
  if (outlets) {
    return (
      <MetaItem>
        {/* A plain span: MetaItem is inline-flex, whose gap would pad the commas */}
        <span>
          {outlets.map((outlet, i) => (
            <Fragment key={outlet.id}>
              {i > 0 && ", "}
              <MetaLink
                className="muted"
                as={Link}
                to={`/read/article?id=${outlet.id}`}
                onClick={(e) => e.stopPropagation()}
              >
                {outlet.label}
              </MetaLink>
            </Fragment>
          ))}
        </span>
      </MetaItem>
    );
  }
  if (!sourceLabel) return null;
  return (
    <MetaItem>
      <MetaLink
        className="muted"
        href={article.parent_url || article.url}
        target="_blank"
        rel="noopener noreferrer"
        onClick={(e) => e.stopPropagation()}
      >
        {sourceLabel}
      </MetaLink>
    </MetaItem>
  );
}
