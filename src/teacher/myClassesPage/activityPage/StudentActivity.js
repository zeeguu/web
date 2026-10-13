import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { APIContext } from "../../../contexts/APIContext";
import LocalStorage from "../../../assorted/LocalStorage";
import LoadingAnimation from "../../../components/LoadingAnimation";
import EmptyState from "../../../components/EmptyState";
import { CenteredContentContainer } from "../../../components/ColumnWidth.sc";
import ActivitySummary from "../../../words/sessionHistory/ActivitySummary";
import SessionTimeline from "../../../words/sessionHistory/SessionTimeline";
import PeriodPicker from "../../../words/sessionHistory/PeriodPicker";
import { PRESETS, periodRange } from "../../../words/sessionHistory/periodRange";

// The period the teacher last chose on any student tab (days), when it is one
// of the presets here.
function rememberedPeriod() {
  const days = String(LocalStorage.selectedTimePeriod());
  return PRESETS.some((p) => p.key === days) ? days : "30";
}

// Everything a student did in the class's language -- reading, exercises,
// browsing the article list, listening -- as they see it in their own
// Activity -> History. Browsing counts too: a student who previewed and
// translated but never opened an article looked idle on the old tabs.
export default function StudentActivity() {
  const api = useContext(APIContext);
  const { studentID, cohortID } = useParams();
  const [period, setPeriod] = useState(rememberedPeriod);
  const [custom, setCustom] = useState(null);
  const [sessions, setSessions] = useState();

  useEffect(() => {
    const range = periodRange(period, custom);
    if (!range) return; // a custom range is fetched once applied
    setSessions(undefined);
    api.getStudentSessionHistory(studentID, cohortID, range.fromDate, range.toDate, setSessions, () => setSessions([]));
  }, [api, studentID, cohortID, period, custom]);

  function choose(newPeriod, newCustom) {
    setPeriod(newPeriod);
    setCustom(newCustom);
    // The Reading and Exercises tabs still count in days: keep them on the
    // same period when it is one they know.
    if (Number(newPeriod)) LocalStorage.setSelectedTimePeriod(newPeriod);
  }

  let timeline = (
    <>
      <ActivitySummary sessions={sessions} label="Overview" />
      <SessionTimeline sessions={sessions} linkArticles={false} forTeacher={true} />
    </>
  );
  if (sessions === undefined) timeline = <LoadingAnimation />;
  else if (sessions.length === 0) timeline = <EmptyState message="No activity in this period." fillHeight={false} />;

  return (
    <CenteredContentContainer>
      <PeriodPicker period={period} custom={custom} onChange={choose} busy={sessions === undefined} />
      {timeline}
    </CenteredContentContainer>
  );
}
