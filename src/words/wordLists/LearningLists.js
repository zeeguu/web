import { Link } from "react-router-dom";
import EmptyState from "../../components/EmptyState";
import Word from "../Word";
import { WEB_READER } from "../../reader/ArticleReader";
import CollapsablePanel from "../../components/CollapsablePanel";
import Tooltip from "../../components/TooltipWrapper";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import { LEVEL_DESCRIPTIONS, groupByLevel } from "./wordListLogic";

const NEXT_IN_LINE_FOR_LEARNER =
  "These words will be added to your exercises soon. They come from your translations and are prioritized by how frequently they appear in the language you're learning.";
const NEXT_IN_LINE_FOR_TEACHER =
  "These words will be added to the student's exercises soon. They come from their translations and are prioritized by how frequently they appear in the language.";

// The Words > Learning lists: the words in exercises by level, then those
// next in line. Shared by the learner's own page and the teacher's view of a
// student.
//
// forTeacher: read-only, worded about "the student", and with two more things
// the old teacher lists showed: each word's attempts (wordExtras) and the
// words left out of exercises (excluded).
export default function LearningLists({
  inLearning,
  nextInLearning,
  excluded = null,
  maxWordsToSchedule = null,
  forTeacher = false,
  notifyDelete = () => {},
  onWordRemovedFromExercises = null,
  wordExtras = () => null,
}) {
  const byLevel = groupByLevel(inLearning);

  const topMessage = (level, count) => (
    <>
      Level {level}: {LEVEL_DESCRIPTIONS[level]}{" "}
      <span style={{ color: "gray", fontWeight: "lighter" }}>
        ({count} {count === 1 ? "word" : "words"})
      </span>
      {level === 1 && (
        <Tooltip label="Words progress through 4 levels with increasingly harder exercises. Answer correctly on two different days to advance to the next level.">
          <HelpOutlineIcon
            style={{ fontSize: "1em", marginLeft: "0.3em", color: "#888", cursor: "help", verticalAlign: "middle" }}
          />
        </Tooltip>
      )}
    </>
  );

  const word = (each, props = {}) => (
    <Word
      key={each.id}
      bookmark={each}
      source={WEB_READER}
      notifyDelete={notifyDelete}
      showRanking={true}
      disableEdit={forTeacher}
      {...props}
    >
      {wordExtras(each)}
    </Word>
  );

  const emptyMessage = forTeacher
    ? "No words in the student's exercises yet."
    : "No words in your exercises yet. Translate words while reading to add them.";

  const nextInLine = nextInLearning.length > 0 && (
    <>
      <h1>Next in exercises...</h1>
      <p>{forTeacher ? NEXT_IN_LINE_FOR_TEACHER : NEXT_IN_LINE_FOR_LEARNER}</p>
      {!forTeacher && maxWordsToSchedule && inLearning.length >= maxWordsToSchedule && (
        <p>
          You can have up to {maxWordsToSchedule} words in learning at a given moment.{" "}
          <Link to="/account_settings/exercise_scheduling">Change this in settings</Link>.
        </p>
      )}
      {nextInLearning.map((each) => word(each, { isGrayedOut: true }))}
      <br />
      <br />
    </>
  );

  const leftOut = excluded && excluded.length > 0 && (
    <CollapsablePanel
      topMessage={
        <>
          Not in exercises{" "}
          <span style={{ color: "gray", fontWeight: "lighter" }}>
            ({excluded.length} {excluded.length === 1 ? "word" : "words"}: left out by Zeeguu, e.g. names, very common
            words, unclear examples, or by the student)
          </span>
        </>
      }
    >
      {excluded.map((each) => word(each, { isGrayedOut: true }))}
    </CollapsablePanel>
  );

  return (
    <>
      {inLearning.length === 0 && <EmptyState message={emptyMessage} fillHeight={false} />}

      {[1, 2, 3, 4].map(
        (level) =>
          byLevel[level].length > 0 && (
            <CollapsablePanel key={level} topMessage={topMessage(level, byLevel[level].length)}>
              {byLevel[level].map((each) => word(each, { onWordRemovedFromExercises, isOnCongratulationsPage: false }))}
            </CollapsablePanel>
          ),
      )}

      <br />
      {nextInLine}
      {leftOut}
    </>
  );
}
