import { useState, useEffect, useContext } from "react";
import LoadingAnimation from "../components/LoadingAnimation";
import EmptyState from "../components/EmptyState";
import strings from "../i18n/definitions";
import { setTitle } from "../assorted/setTitle";
import { APIContext } from "../contexts/APIContext";
import EditBookmarkModal from "./EditBookmarkModal";
import ActivitySummary from "./sessionHistory/ActivitySummary";
import SessionTimeline from "./sessionHistory/SessionTimeline";
import * as s from "./SessionHistory.sc";
import { toast } from "react-toastify";
import { isTextInSentence } from "../utils/text/expressions";
import { validateWordInContext } from "../utils/validation/wordContextValidation";

function getStartOfWeek() {
  const now = new Date();
  const day = now.getDay();
  const diff = now.getDate() - day + (day === 0 ? -6 : 1); // Monday
  const monday = new Date(now.setDate(diff));
  monday.setHours(0, 0, 0, 0);
  return monday;
}

function getStartOfMonth() {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), 1);
}

function formatDateForInput(date) {
  return date.toISOString().split("T")[0];
}

export default function SessionHistory() {
  const api = useContext(APIContext);
  const [sessions, setSessions] = useState();
  const [loading, setLoading] = useState(false);
  const [timeRange, setTimeRange] = useState("7");

  // Pending values for custom date inputs (not yet applied)
  const [pendingFrom, setPendingFrom] = useState(formatDateForInput(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)));
  const [pendingTo, setPendingTo] = useState(formatDateForInput(new Date()));

  // Applied custom dates (used for fetching)
  const [appliedFrom, setAppliedFrom] = useState(null);
  const [appliedTo, setAppliedTo] = useState(null);

  // Edit modal state
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editBookmark, setEditBookmark] = useState(null);
  const [editError, setEditError] = useState(null);
  const [loadingBookmark, setLoadingBookmark] = useState(false);

  const handleEditWord = (bookmarkId) => {
    if (!bookmarkId) {
      toast.error("Cannot edit this word.");
      return;
    }
    setLoadingBookmark(true);
    const dismissWithError = () => {
      setLoadingBookmark(false);
      toast.error(strings.couldNotLoadWordDetails);
    };
    api.getBookmarkWithContext(
      bookmarkId,
      (bookmark) => {
        if (bookmark && typeof bookmark.from === "string") {
          setLoadingBookmark(false);
          setEditBookmark(bookmark);
          setTimeout(() => setEditModalOpen(true), 0);
        } else {
          dismissWithError();
        }
      },
      dismissWithError,
    );
  };

  const handleEditClose = () => {
    setEditModalOpen(false);
    setEditBookmark(null);
    setEditError(null);
  };

  const updateBookmark = (bookmark, newWord, newTranslation, newContext, newFitForStudy) => {
    if (!isTextInSentence(newWord, newContext)) {
      setEditError(`'${newWord}' is not present in the context. Make sure the context contains the word.`);
      return;
    }

    const validation = validateWordInContext(newWord, newContext);
    if (!validation.valid) {
      setEditError(validation.errorMessage);
      return;
    }

    api
      .updateBookmark(bookmark.id, newWord, newTranslation, newContext, bookmark.context_identifier)
      .then((response) => {
        if (response.status >= 400) {
          throw new Error(response.data);
        }
        return response.data;
      })
      .then((newBookmark) => {
        // Update the word in sessions to reflect changes
        setSessions((prevSessions) =>
          prevSessions.map((session) => ({
            ...session,
            words: session.words.map((word) =>
              word.id === bookmark.id ? { ...word, origin: newBookmark.from, translation: newBookmark.to } : word,
            ),
          })),
        );

        if (newFitForStudy) {
          api.userSetForExercises(newBookmark.id);
        } else {
          api.userSetNotForExercises(newBookmark.id);
        }

        if (newBookmark._message) {
          toast.info(newBookmark._message);
        } else {
          toast.success("Word updated successfully!");
        }

        handleEditClose();
      })
      .catch((error) => {
        console.error("Error updating bookmark:", error);
        let errorMessage = "Failed to update bookmark. Please try again.";
        try {
          if (typeof error.message === "string") {
            const errorData = JSON.parse(error.message);
            if (errorData.detail) {
              errorMessage = errorData.detail;
            } else if (errorData.error) {
              errorMessage = errorData.error;
            }
          }
        } catch (e) {
          // If parsing fails, use default message
        }
        setEditError(errorMessage);
      });
  };

  const deleteBookmark = () => {
    if (!editBookmark) return;
    api.deleteBookmark(
      editBookmark.id,
      (response) => {
        if (response === "OK") {
          // Remove word from sessions
          setSessions((prevSessions) =>
            prevSessions.map((session) => ({
              ...session,
              words: session.words.filter((word) => word.id !== editBookmark.id),
              word_count: session.words.filter((word) => word.id !== editBookmark.id).length,
            })),
          );
          toast.success("Word deleted successfully!");
          handleEditClose();
        }
      },
      (error) => {
        console.log(error);
        alert("Something went wrong and we could not delete the bookmark; try again later.");
      },
    );
  };

  const applyCustomRange = () => {
    setAppliedFrom(pendingFrom);
    setAppliedTo(pendingTo);
  };

  const getDateRange = () => {
    const now = new Date();
    let fromDate,
      toDate = now;

    switch (timeRange) {
      case "7":
        fromDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        break;
      case "14":
        fromDate = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000);
        break;
      case "30":
        fromDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
        break;
      case "week":
        fromDate = getStartOfWeek();
        break;
      case "month":
        fromDate = getStartOfMonth();
        break;
      case "custom":
        if (appliedFrom && appliedTo) {
          fromDate = new Date(appliedFrom);
          toDate = new Date(appliedTo);
          toDate.setHours(23, 59, 59, 999);
        } else {
          // Default to last 30 days if custom not yet applied
          fromDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
        }
        break;
      default:
        fromDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    }

    return { fromDate, toDate };
  };

  const getDisplayLabel = () => {
    switch (timeRange) {
      case "7":
        return "Last 7 days";
      case "14":
        return "Last 14 days";
      case "30":
        return "Last 30 days";
      case "week":
        return "This week";
      case "month":
        return "This month";
      case "custom":
        return appliedFrom && appliedTo ? `${appliedFrom} to ${appliedTo}` : "Custom range";
      default:
        return "Last 7 days";
    }
  };

  useEffect(() => {
    // Don't fetch if custom is selected but not yet applied
    if (timeRange === "custom" && (!appliedFrom || !appliedTo)) {
      return;
    }

    setLoading(true);
    const { fromDate, toDate } = getDateRange();
    api.getSessionHistoryByRange(
      fromDate.toISOString(),
      toDate.toISOString(),
      (data) => {
        setSessions(data);
        setLoading(false);
      },
      () => {
        setSessions([]);
        setLoading(false);
      },
    );
    setTitle("My Activity");
  }, [api, timeRange, appliedFrom, appliedTo]);

  const isCustomNotApplied = timeRange === "custom" && (!appliedFrom || !appliedTo);

  if (sessions === undefined && !isCustomNotApplied) {
    return <LoadingAnimation />;
  }

  return (
    <>
      <s.TimeSelector>
        <select value={timeRange} onChange={(e) => setTimeRange(e.target.value)}>
          <option value="7">Last 7 days</option>
          <option value="14">Last 14 days</option>
          <option value="30">Last 30 days</option>
          <option value="week">This week</option>
          <option value="month">This month</option>
          <option value="custom">Custom range</option>
        </select>

        {timeRange === "custom" && (
          <div className="custom-dates">
            <input type="date" value={pendingFrom} onChange={(e) => setPendingFrom(e.target.value)} />
            <span>to</span>
            <input type="date" value={pendingTo} onChange={(e) => setPendingTo(e.target.value)} />
            <button onClick={applyCustomRange} disabled={loading}>
              {loading ? "Loading..." : "Apply"}
            </button>
          </div>
        )}
      </s.TimeSelector>

      {loading && <LoadingAnimation />}

      {!loading && sessions && sessions.length === 0 && (
        <EmptyState message={`No activity recorded for ${getDisplayLabel().toLowerCase()}.`} fillHeight={false} />
      )}

      {!loading && sessions && sessions.length > 0 && <ActivitySummary sessions={sessions} label="Overview" />}

      {!loading && sessions && <SessionTimeline sessions={sessions} onEditWord={handleEditWord} />}

      {/* Loading indicator when fetching bookmark for edit */}
      {loadingBookmark && (
        <s.OverlayLoader>
          <LoadingAnimation />
        </s.OverlayLoader>
      )}

      {/* Edit Word Modal */}
      <EditBookmarkModal
        open={editModalOpen}
        onClose={handleEditClose}
        bookmark={editBookmark}
        errorMessage={editError}
        updateBookmark={updateBookmark}
        deleteAction={deleteBookmark}
      />
    </>
  );
}
