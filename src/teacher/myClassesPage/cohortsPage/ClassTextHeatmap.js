import { useState } from "react";
import * as h from "../../styledComponents/TextFilterBar.sc";
import { heatColor, lookupsByToken, studentsLabel, thresholdOptions } from "./classTextLines";
import * as s from "./ClassText.sc";

// The block tags a fragment may carry (ArticleFragment.formatting); anything
// else renders as a paragraph.
const BLOCK_TAGS = ["p", "h1", "h2", "h3", "h4", "h5", "h6", "li", "blockquote"];

/**
 * The text, each word coloured by how many of the class looked it up: light
 * green for one student, red for the most. A filter hides the colour below
 * "looked up by at least N"; tapping a coloured word names the students.
 *
 * `threshold` is owned by the page, which filters the word list by it too.
 */
export default function ClassTextHeatmap({ info, threshold, setThreshold }) {
  const [picked, setPicked] = useState(null);
  const names = Object.fromEntries(info.readers.map((r) => [r.id, r.name]));
  const parts = [info.tokenized_title_new, ...info.tokenized_fragments].filter((part) => part?.tokens);
  const maxStudents = Math.max(1, ...parts.flatMap((part) => (part.lookups || []).map((l) => l.students.length)));

  return (
    <>
      <h.FilterBar>
        <span>Looked up by at least</span>
        {thresholdOptions(maxStudents).map((n) => (
          <h.Chip key={n} type="button" $on={threshold === n} aria-pressed={threshold === n} onClick={() => setThreshold(n)}>
            {studentsLabel(n)}
          </h.Chip>
        ))}
        <s.Legend className="trailing">
          <span>1</span>
          <span className="scale" style={{ background: scaleGradient(maxStudents) }} />
          <span>{maxStudents}</span>
        </s.Legend>
      </h.FilterBar>

      {picked && (
        <s.PickedWord>
          <strong>{picked.word}</strong> — {studentsLabel(picked.students.length)}:{" "}
          {picked.students.map((id) => names[id] || "a student").join(", ")}
        </s.PickedWord>
      )}

      <s.HeatText>
        {parts.map((part, i) => (
          <HeatPart
            key={i}
            part={part}
            isTitle={part === info.tokenized_title_new}
            threshold={threshold}
            maxStudents={maxStudents}
            onPick={setPicked}
          />
        ))}
      </s.HeatText>
    </>
  );
}

function HeatPart({ part, isTitle, threshold, maxStudents, onPick }) {
  const byToken = lookupsByToken(part.lookups);
  const Tag = isTitle ? "h2" : BLOCK_TAGS.includes(part.formatting) ? part.formatting : "p";

  return part.tokens.map((paragraph, p) => (
    <Tag key={p}>
      {paragraph.flat().map((token) => {
        const students = byToken.get(`${token.sent_i}:${token.token_i}`);
        const space = token.has_space ? " " : "";
        if (!students || students.length < threshold) return token.text + space;
        return (
          <span key={`${token.sent_i}:${token.token_i}`}>
            <s.HeatWord
              type="button"
              style={{ background: heatColor(students.length, maxStudents) }}
              title={studentsLabel(students.length)}
              onClick={() => onPick({ word: token.text, students })}
            >
              {token.text}
            </s.HeatWord>
            {space}
          </span>
        );
      })}
    </Tag>
  ));
}

function scaleGradient(maxStudents) {
  const stops = [1, Math.ceil(maxStudents / 2), maxStudents].map((n) => heatColor(n, maxStudents));
  return `linear-gradient(to right, ${stops.join(", ")})`;
}
