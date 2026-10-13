import { useState, useEffect, useContext } from "react";
import LoadingAnimation from "../components/LoadingAnimation";
import EmptyState from "../components/EmptyState";
import strings from "../i18n/definitions";
import { setTitle } from "../assorted/setTitle";
import { APIContext } from "../contexts/APIContext";
import EditBookmarkModal from "./EditBookmarkModal";
import ActivitySummary from "./sessionHistory/ActivitySummary";
import SessionTimeline from "./sessionHistory/SessionTimeline";
import PeriodPicker from "./sessionHistory/PeriodPicker";
import { periodRange, periodLabel } from "./sessionHistory/periodRange";
import * as s from "./SessionHistory.sc";
import { toast } from "react-toastify";
import { isTextInSentence } from "../utils/text/expressions";
import { validateWordInContext } from "../utils/validation/wordContextValidation";

export default function SessionHistory() {
  const api = useContext(APIContext);
  const [sessions, setSessions] = useState();
  const [loading, setLoading] = useState(false);
  const [period, setPeriod] = useState("7");
  const [custom, setCustom] = useState(null); // { from, to } once applied

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

  useEffect(() => {
    const range = periodRange(period, custom);
    // a custom range is fetched once applied
    if (!range) return;

    setLoading(true);
    const { fromDate, toDate } = range;
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
  }, [api, period, custom]);

  const isCustomNotApplied = period === "custom" && !custom;

  if (sessions === undefined && !isCustomNotApplied) {
    return <LoadingAnimation />;
  }

  return (
    <>
      <PeriodPicker
        period={period}
        custom={custom}
        busy={loading}
        onChange={(newPeriod, newCustom) => {
          setPeriod(newPeriod);
          setCustom(newCustom);
        }}
      />

      {loading && <LoadingAnimation />}

      {!loading && sessions && sessions.length === 0 && (
        <EmptyState
          message={`No activity recorded for ${periodLabel(period, custom).toLowerCase()}.`}
          fillHeight={false}
        />
      )}

      {!loading && sessions && sessions.length > 0 && <ActivitySummary sessions={sessions} />}

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
