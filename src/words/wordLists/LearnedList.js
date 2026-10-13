import CompactWord from "../CompactWord";
import * as s from "../../components/TopMessage.sc";
import * as l from "./LearnedList.sc";
import CollapsablePanel from "../../components/CollapsablePanel";
import { calculateMedianRank, groupByMonth, isSelfReported } from "./wordListLogic";

// The Words > Learned list by month. Shared by the learner's own page and the
// teacher's view of a student (forTeacher: worded about the student, each word
// with wordExtras under it and marked when self-reported).
export default function LearnedList({ learnedWords, totalWordsLearned, forTeacher = false, wordExtras = null }) {
  const months = groupByMonth(learnedWords);

  function topMessage(monthKey, count, medianRank) {
    const [year, month] = monthKey.split("-");
    const monthName = new Date(year, month - 1, 1).toLocaleDateString("en-US", { month: "long", year: "numeric" });
    return (
      <>
        <span style={{ color: "#007bff", fontWeight: "bold", fontSize: "1.2em" }}>{monthName}</span>{" "}
        <span style={{ color: "gray", fontWeight: "lighter" }}>
          ({count} words{count > 20 && medianRank ? `, median rank: ${medianRank}` : ""})
        </span>
      </>
    );
  }

  const summary = forTeacher ? (
    <>
      The student has learned <b>{totalWordsLearned}</b> words so far.
    </>
  ) : (
    <>
      {totalWordsLearned > 10 ? "Congratulations! " : " "}
      You have learned <b>{totalWordsLearned}</b> words so far.
    </>
  );

  // The learner's page: a compact cloud. The teacher's: one word per line,
  // with its attempts under it.
  function monthWords(words) {
    if (!wordExtras) {
      return (
        <l.WordsOfMonth>
          {words.map((each) => (
            <CompactWord key={each.id} bookmark={each} />
          ))}
        </l.WordsOfMonth>
      );
    }
    return words.map((each) => (
      <div key={each.id}>
        <CompactWord bookmark={each} />
        {isSelfReported(each) && <l.SelfReported>self-reported: last marked "too easy"</l.SelfReported>}
        {wordExtras(each)}
      </div>
    ));
  }

  return (
    <>
      <s.YellowMessageBox>
        <br />
        <div>{summary}</div>
        <br />
        <div style={{ textAlign: "left", marginLeft: "1em", fontSize: "smaller" }}>
          A word is learned when done correctly in exercises in all the four levels.
        </div>
        <br />
      </s.YellowMessageBox>
      {months.map((monthGroup) => {
        const medianRank = monthGroup.words.length > 20 ? calculateMedianRank(monthGroup.words) : null;
        return (
          <CollapsablePanel
            key={`month-${monthGroup.monthKey}`}
            topMessage={topMessage(monthGroup.monthKey, monthGroup.words.length, medianRank)}
          >
            {monthWords(monthGroup.words)}
          </CollapsablePanel>
        );
      })}
    </>
  );
}
