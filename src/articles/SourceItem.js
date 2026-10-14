import { Fragment } from "react";
import { MetaItem, MetaLink } from "../components/MetaStrip.sc";
import { storyOutlets } from "../utils/misc/articleHelpers";

// Where the card's text comes from, in its meta strip: the publisher, linked to
// the original. A story several outlets ran lists them all as equals -- no
// "also in" -- each linking to its own original, so the learner picks whose
// version to read. Like the single source link, these go to the publisher, not
// the reader: whether an article opens inside Zeeguu is the card's decision
// (should_open_in_zeeguu), and an outlet link must not get around it.
export default function SourceItem({ article, sourceLabel, onOpen }) {
  const outlets = storyOutlets(article);
  const link = (href, label) => (
    <MetaLink
      className="muted"
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onClick={(e) => {
        e.stopPropagation();
        onOpen?.();
      }}
    >
      {label}
    </MetaLink>
  );

  if (outlets) {
    return (
      <MetaItem>
        {/* A plain span: MetaItem is inline-flex, whose gap would pad the commas */}
        <span>
          {outlets.map((outlet, i) => (
            <Fragment key={outlet.id}>
              {i > 0 && ", "}
              {link(outlet.url, outlet.label)}
            </Fragment>
          ))}
        </span>
      </MetaItem>
    );
  }
  if (!sourceLabel) return null;
  return <MetaItem>{link(article.parent_url || article.url, sourceLabel)}</MetaItem>;
}
