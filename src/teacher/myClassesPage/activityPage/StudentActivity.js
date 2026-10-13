import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { APIContext } from "../../../contexts/APIContext";
import LocalStorage from "../../../assorted/LocalStorage";
import TimeSelector from "../../sharedComponents/TimeSelector";
import LoadingAnimation from "../../../components/LoadingAnimation";
import EmptyState from "../../../components/EmptyState";
import { CenteredContentContainer } from "../../../components/ColumnWidth.sc";
import ActivitySummary from "../../../words/sessionHistory/ActivitySummary";
import SessionTimeline from "../../../words/sessionHistory/SessionTimeline";

// Everything a student did in the class's language -- reading, exercises,
// browsing the article list, listening -- as they see it in their own
// Activity -> History. Browsing counts too: a student who previewed and
// translated but never opened an article looked idle on the old tabs.
export default function StudentActivity() {
  const api = useContext(APIContext);
  const { studentID, cohortID } = useParams();
  const [forceUpdate, setForceUpdate] = useState(0);
  const [sessions, setSessions] = useState();

  useEffect(() => {
    setSessions(undefined);
    api.getStudentSessionHistory(studentID, cohortID, LocalStorage.selectedTimePeriod(), setSessions, () =>
      setSessions([]),
    );
  }, [api, studentID, cohortID, forceUpdate]);

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
      <TimeSelector setForceUpdate={setForceUpdate} customText="Activity in the " />
      {timeline}
    </CenteredContentContainer>
  );
}
