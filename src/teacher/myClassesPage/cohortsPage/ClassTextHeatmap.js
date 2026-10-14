import { Tooltip } from "@mui/material";
import * as h from "../../styledComponents/TextFilterBar.sc";
import { heatColor, studentsByToken, studentsLabel, thresholdOptions } from "./classTextLines";
import * as s from "./ClassText.sc";

// The block tags a fragment may carry (ArticleFragment.formatting); anything
// else renders as a paragraph.
const BLOCK_TAGS = ["p", "h1", "h2", "h3", "h4", "h5", "h6", "li", "blockquote"];

/**
 * The text, each word coloured by how many of the class looked it up: light
 * green for one student, red for the most. A filter hides the colour below
 * "looked up by at least N". Hovering a coloured word (tapping, on a phone)
 * lists who looked it up and the translation each of them got.
 *
 * `threshold` is owned by the page, which filters the word list by it too.
 */
export default function ClassTextHeatmap({ info, threshold, setThreshold }) {
  const names = Object.fromEntries(info.readers.map((r) => [r.id, r.name]));
  const parts = [{ ...info.tokenized_title_new, isTitle: true }, ...info.tokenized_fragments]
    .filter((part) => part.tokens)
    .map((part) => ({ ...part, byToken: studentsByToken(part) }));
  const maxStudents = Math.max(1, ...parts.flatMap((part) => [...part.byToken.values()].map((s) => s.length)));

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

      <s.HeatText>
        {parts.map((part, i) => (
          <HeatPart
            key={i}
            part={part}
            threshold={threshold}
            maxStudents={maxStudents}
            names={names}
          />
        ))}
      </s.HeatText>
    </>
  );
}

function HeatPart({ part, threshold, maxStudents, names }) {
  const { byToken } = part;
  const Tag = part.isTitle ? "h2" : BLOCK_TAGS.includes(part.formatting) ? part.formatting : "p";

  return part.tokens.map((paragraph, p) => (
    <Tag key={p}>
      {paragraph.flat().map((token) => {
        const students = byToken.get(`${token.sent_i}:${token.token_i}`);
        const space = token.has_space ? " " : "";
        if (!students || students.length < threshold) return token.text + space;
        return (
          <span key={`${token.sent_i}:${token.token_i}`}>
            <Tooltip arrow enterTouchDelay={0} leaveTouchDelay={4000} title={<WhoLookedUp students={students} names={names} />}>
              <s.HeatWord type="button" style={{ background: heatColor(students.length, maxStudents) }}>
                {token.text}
              </s.HeatWord>
            </Tooltip>
            {space}
          </span>
        );
      })}
    </Tag>
  ));
}

// The tooltip: "3 students", then each with the translation they got.
function WhoLookedUp({ students, names }) {
  return (
    <s.WhoLookedUp>
      <div className="count">{studentsLabel(students.length)}</div>
      {students.map((student) => (
        <div key={student.id}>
          {names[student.id] || "a student"} <span className="translation">→ {student.translation}</span>
        </div>
      ))}
    </s.WhoLookedUp>
  );
}

function scaleGradient(maxStudents) {
  const stops = [1, Math.ceil(maxStudents / 2), maxStudents].map((n) => heatColor(n, maxStudents));
  return `linear-gradient(to right, ${stops.join(", ")})`;
}
