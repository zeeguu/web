import { Zeeguu_API } from "./classDef";
import queryString from "query-string";
/**
 * Loads an invidiual user's data.
 * Requires permission (the logged in teacher must be a teacher of the class containing user with user_id ).
 * @param {integer} userId used to find user.
 * @param {integer} duration
 * @returns {object} object containing (id, name, email, reading time, exercises done, last article)
 */
Zeeguu_API.prototype.loadUserInfo = function (userID, duration, callback) {
  this._get(`/user_info/${userID}/${duration}`, callback);
};

Zeeguu_API.prototype.getReadingSessions = function (studentID, cohortID, duration, onSuccess, onError) {
  let payload = {
    student_id: studentID,
    number_of_days: duration,
    cohort_id: cohortID
  }
  this._post(`/student_reading_sessions`,
    queryString.stringify(payload),
    onSuccess,
    onError,
    true
  );
};

Zeeguu_API.prototype.getStudentActivityOverview = function (studentID, duration, cohortID, onSuccess, onError) {
  let payload = {
    student_id: studentID,
    number_of_days: duration,
    cohort_id: cohortID
  }
  this._post(`/student_activity_overview`,
    queryString.stringify(payload),
    onSuccess,
    onError,
    true
  );
};

Zeeguu_API.prototype.loadUserSessions = async function (
  userID,
  duration,
  callback
) {
  let getBookmarks = await this.apiGet(
    `/cohort_member_bookmarks/${userID}/${duration}`
  );
  let getSessions = await this.apiGet(
    `/cohort_member_reading_sessions/${userID}/${duration}`
  );
  return Promise.all([getBookmarks, getSessions]).then((values) => {
    let [{ data: bookmarks }, { data: sessions }] = values;
    bookmarks = filterUserBookmarks(bookmarks);
    bookmarks = transformUserBookmarks(bookmarks);
    sessions = transformUserSession(sessions);
    const userData = makeUserData(sessions, bookmarks);
    callback(userData);
  });
};
/**
 * Takes an array of bookmarks and removed duplicate items
 * @param {Array} data
 */
function filterUserBookmarks(data) {
  let wordString = " ";

  const result = data.map((day) => {
    const newBookmarks = day["bookmarks"].reduce(function (acc, bookmark) {
      if (wordString.includes(bookmark["from"])) {
        return acc;
      } else {
        wordString = bookmark["from"];
        acc.push(bookmark);
        return acc;
      }
    }, []);
    return { ...day, bookmarks: newBookmarks };
  });
  return result;
}

function transformUserBookmarks(data) {
  let masterList = [];
  data.forEach((day) => {
    let masterElement = {};
    masterElement.date = day.date;
    masterElement["article_list"] = [];
    masterList.push(masterElement);
    day.bookmarks.forEach((bookmark) => {
      let existsArticle = false;
      masterElement["article_list"].forEach((article) => {
        if (article.title === bookmark.title) {
          existsArticle = true;
          let existsSentence = false;
          article.sentence_list.forEach((sentence) => {
            if (sentence.context === bookmark.context) {
              existsSentence = true;
              sentence.bookmarks.push(bookmark);
            }
          });
          if (!existsSentence) {
            let sentenceElement = {};
            sentenceElement.context = bookmark.context;
            sentenceElement.bookmarks = [];
            sentenceElement.bookmarks.push(bookmark);
            article.sentence_list.push(sentenceElement);
          }
        }
      });
      if (!existsArticle) {
        let articleElement = {};
        articleElement.title = bookmark.title;
        articleElement.url = bookmark.url;
        articleElement.sentence_list = [];
        masterElement.article_list.push(articleElement);
        let sentenceElement = [];
        sentenceElement.context = bookmark.context;
        sentenceElement.bookmarks = [];
        articleElement.sentence_list.push(sentenceElement);
        sentenceElement.bookmarks.push(bookmark);
      }
    });
  });
  return masterList;
}

function transformUserSession(readingSessions) {
  const result = readingSessions.map((day) => {
    const squashedSessions = {};
    day.reading_sessions.forEach((readingSession) => {
      const id = readingSession.article_id;
      if (!squashedSessions[id]) {
        squashedSessions[id] = readingSession;
      } else {
        squashedSessions[id].duration += readingSession.duration;
      }
    });
    return {
      ...day,
      reading_sessions: Object.values(squashedSessions), //the values function takes the values of an object and turns them into an array
    };
  });
  return result;
}

function makeUserData(readingSessions, bookmarks) {
  return readingSessions.map((readingSessionDay) => {
    let bookmarksForDay = bookmarks.find((bookmarkDay) => {
      return bookmarkDay.date === readingSessionDay.date;
    });
    let sessionsWithBookmarks = readingSessionDay.reading_sessions.map(
      (readingSession) => {
        let bookmarksForSession;
        if (!bookmarksForDay) {
          bookmarksForSession = { sentence_list: [] };
        } else {
          bookmarksForSession = bookmarksForDay.article_list.find((article) => {
            return article.title === readingSession.article_title;
          });
        }
        if (!bookmarksForSession) {
          bookmarksForSession = { sentence_list: [] };
        }
        return { ...readingSession, bookmarks: bookmarksForSession };
      }
    );
    return { ...readingSessionDay, reading_sessions: sessionsWithBookmarks };
  });
}
