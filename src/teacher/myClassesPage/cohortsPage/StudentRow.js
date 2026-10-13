import { useState } from "react";
import { useHistory } from "react-router-dom";
import DeleteStudentWarning from "./DeleteStudentWarning";
import * as t from "./ClassTable.sc";
import { barWidthPercent, correctText, lastActiveText, minutesText } from "./studentRowText";

const KIND_LABEL = {
  reading_time: "Reading",
  exercise_time: "Exercises",
  browsing_time: "Browsing",
  audio_time: "Listening",
};

// One student in the class table. The row opens the student; × removes them
// from the class (after asking).
export default function StudentRow({ student, cohortID, classMaxTime, duplicates = [], removeStudentFromCohort }) {
  const history = useHistory();
  const [confirmingRemove, setConfirmingRemove] = useState(false);
  const open = () => history.push(`/teacher/classes/viewStudent/${student.id}/class/${cohortID}`);

  const breakdown = (student.activity_segments || [])
    .map((segment) => `${KIND_LABEL[segment.kind]}: ${minutesText(segment.seconds)}`)
    .join("\n");

  let timeCell = <t.Muted>no activity</t.Muted>;
  if (student.total_time > 0) {
    timeCell = (
      <t.TimeCell title={breakdown}>
        <t.Bar>
          <t.BarFill style={{ width: `${barWidthPercent(student.total_time, classMaxTime)}%` }}>
            {student.activity_segments.map((segment) => (
              <t.Segment key={segment.kind} $kind={segment.kind} style={{ width: `${segment.percent}%` }} />
            ))}
          </t.BarFill>
        </t.Bar>
        <t.Minutes>{minutesText(student.total_time)}</t.Minutes>
      </t.TimeCell>
    );
  }

  return (
    <>
      <t.Row onClick={open}>
        <td className="name">
          <t.Name>{student.name}</t.Name>
          <t.Sub className="email">{student.email}</t.Sub>
          {duplicates.length > 0 && (
            <t.Sub
              className="duplicate"
              title="Two accounts with the same name or the same email before the @. Look at both; the account-merge tool can join them."
            >
              Same student? Also here as {duplicates.map((other) => other.email).join(", ")}
            </t.Sub>
          )}
        </td>
        <td className="last-active">
          <t.Muted>{lastActiveText(student.last_active)}</t.Muted>
        </td>
        <td className="time">{timeCell}</td>
        <td className="num texts" data-label="texts">
          {student.number_of_texts || "–"}
        </td>
        <td className="num exercises" data-label="exercises">
          {student.number_of_exercises || "–"}
        </td>
        <td className="num correct" data-label="correct" title="Correct on the first try (shown from 10 exercises on)">
          {correctText(student)}
        </td>
        <td className="num remove">
          <t.Remove
            aria-label={`Remove ${student.name} from the class`}
            title="Remove from the class"
            onClick={(e) => {
              e.stopPropagation();
              setConfirmingRemove(true);
            }}
          >
            ×
          </t.Remove>
        </td>
      </t.Row>
      {/* a dialog: it renders in an overlay, not in the table */}
      {confirmingRemove && (
        <DeleteStudentWarning
          studentName={student.name}
          cohortID={cohortID}
          removeStudent={() => {
            removeStudentFromCohort(student.id, cohortID);
            setConfirmingRemove(false);
          }}
          setShowDeleteStudentWarning={setConfirmingRemove}
        />
      )}
    </>
  );
}
