import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import LoadingAnimation from "../components/LoadingAnimation";

export default function Learned({ zapi }) {
  const [words, setWords] = useState(null);

  useEffect(() => {
    zapi.learnedBookmarks(300, (learnedWords) => {
      console.log(learnedWords);
      setWords(learnedWords);
    });
  }, [zapi]);

  if (!words) {
    return <LoadingAnimation />;
  }

  if (words.length === 0) {
    return (
      <div className="topMessageContainer">
        <div className="topMessage">
          Learned words are words that were correct in exercises in 4 different
          days.
        </div>
      </div>
    );
  }

  function deleteBookmark(bookmark) {
    zapi.deleteBookmark(bookmark.id);
    setWords(words.filter((e) => e.id !== bookmark.id));
  }

  return (
    <div className="mainWordsContainer">
      <div className="topMessageContainer">
        <div className="topMessage">
          Learned words are words that were correct in exercises in 4 different
          days.
        </div>
      </div>

      <div className="learnedWordsContainer">
        <div class="amount">
          <p>
            You have learned <b>{words.length}</b> words so far.
          </p>
        </div>

        {words.map((each) => (
          <div class="oneLearnedWord" id="bookmark33593">
            <div class="verticalLine learned"></div>

            <div class="learnedWords">
              <div class="translation">
                <b>{each.from}</b> - {each.to}
              </div>
              <div>
                <p class="learnedDate">
                  <small>Correct on:</small>
                  {" " + each.learned_datetime}
                </p>
              </div>
            </div>

            <div class="deleteLearned">
              <Link
                to="/"
                onClick={(e) => {
                  e.preventDefault();
                  deleteBookmark(each);
                }}
                id="trash"
              >
                <img src="/static/images/trash.svg" alt="trash" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
