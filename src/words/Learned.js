import { useContext, useEffect, useState } from "react";
import LoadingAnimation from "../components/LoadingAnimation";
import { setTitle } from "../assorted/setTitle";
import strings from "../i18n/definitions";
import Word from "./Word";
import * as s from "../components/TopMessage.sc";
import { APIContext } from "../contexts/APIContext";

export default function Learned() {
  const api = useContext(APIContext);
  const [words, setWords] = useState(null);
  const [totalWordsLearned, setTotalWordsLearned] = useState(0);

  function groupByMonth(learnedWords) {
    if (learnedWords.length === 0) return learnedWords;
    
    const grouped = {};
    
    learnedWords.forEach(word => {
      let learnedDate;
      if (word.learned_datetime) {
        learnedDate = new Date(word.learned_datetime);
        
        // Check if date is invalid
        if (isNaN(learnedDate.getTime())) {
          console.warn('Invalid date for word:', word.from, 'learned_datetime:', word.learned_datetime);
          // Skip words with invalid dates
          return;
        }
      } else {
        // Skip words that don't have a learned date (shouldn't happen for learned words)
        console.warn('No learned_datetime for word:', word.from);
        return;
      }
      
      const monthKey = `${learnedDate.getFullYear()}-${String(learnedDate.getMonth() + 1).padStart(2, '0')}`;
      
      if (!grouped[monthKey]) {
        grouped[monthKey] = [];
      }
      grouped[monthKey].push(word);
    });
    
    // Convert to array and sort by month (most recent first)
    const groupedArray = Object.entries(grouped)
      .sort(([a], [b]) => b.localeCompare(a))
      .map(([monthKey, words]) => ({
        monthKey,
        words: words.sort((a, b) => {
          const dateA = new Date(a.learned_datetime);
          const dateB = new Date(b.learned_datetime);
          return dateB - dateA;
        })
      }));
    
    return groupedArray;
  }

  useEffect(() => {
    api.totalLearnedUserWords((totalLearnedCount) => {
      setTotalWordsLearned(totalLearnedCount);
    });
    api.learnedUserWords(300, (learnedWords) => {
      setWords(groupByMonth(learnedWords));
    });
    setTitle(strings.titleLearnedWords);
  }, [api]);

  function onNotifyDelete(bookmark) {
    // Remove the word from all month groups
    let newWords = words.map(monthGroup => ({
      ...monthGroup,
      words: monthGroup.words.filter(word => word.id !== bookmark.id)
    })).filter(monthGroup => monthGroup.words.length > 0); // Remove empty months
    setWords(newWords);
  }

  if (!words) {
    return <LoadingAnimation />;
  }

  function formatMonthHeader(monthKey) {
    const [year, month] = monthKey.split('-');
    const date = new Date(year, month - 1, 1);
    const monthName = date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    return monthName;
  }

  return (
    <>
      <s.YellowMessageBox>
        <br />
        <div>
          {totalWordsLearned > 10 ? "Congratulations! " : " "}
          You have learned <b>{totalWordsLearned}</b> words so far.
        </div>
        <br />
        <div style={{ textAlign: "left", marginLeft: "1em", fontSize: "smaller" }}>
          A word is learned when done correctly in exercises in all the four levels. Or when it is marked as{" "}
          <i>"too easy"</i> by you after you have done several exercises with it.
        </div>

        <br />
      </s.YellowMessageBox>
      <div>
        {words.map((monthGroup, groupIndex) => {
          return (
            <div key={`month-${monthGroup.monthKey}`}>
              <h3 style={{ marginTop: '2em', marginBottom: '1em', color: '#4a90e2' }}>
                {formatMonthHeader(monthGroup.monthKey)} ({monthGroup.words.length})
              </h3>
              {monthGroup.words.map((each) => {
                return <Word key={each.id} notifyDelete={onNotifyDelete} bookmark={each} hideStar={true} hideLevelIndicator={true} disableEdit={true} />;
              })}
            </div>
          );
        })}
      </div>
    </>
  );
}
