//This function is used to set each students data relative to the other students' data for the studentActivityBar to be rendered correctly.
// The kinds of activity a student's bar is made of, in the order they appear.
// Seconds; browsing_time and audio_time are absent from older API responses.
export const ACTIVITY_KINDS = ["reading_time", "exercise_time", "browsing_time", "audio_time"];

// [{ kind, seconds, percent }] for the kinds a student spent time on, percent
// being the share of the student's own total.
export function activitySegments(student) {
  const total = ACTIVITY_KINDS.reduce((sum, kind) => sum + (student[kind] || 0), 0);
  if (total === 0) return [];
  return ACTIVITY_KINDS.filter((kind) => student[kind] > 0).map((kind) => ({
    kind,
    seconds: student[kind],
    percent: (100 * student[kind]) / total,
  }));
}

export function transformStudents(students) {
  let maxActivity = 0;

  let transformedStudents = students.map((student) => {
    const total_time = ACTIVITY_KINDS.reduce((sum, kind) => sum + (student[kind] || 0), 0);

    maxActivity = maxActivity > total_time ? maxActivity : total_time;
    return {
      ...student,
      activity_segments: activitySegments(student),
      total_time,
    };
  });
  if (maxActivity > 240) {
    transformedStudents = transformedStudents.map((student) => addTotalAndNormalizedTime(student, maxActivity));
  }
  return transformedStudents;
}

/**
 * Add normalized time to a student
 * @param {Student} student the student that should have
 * @param {number} maxActivity the max activity compared with the other students
 */
export function addTotalAndNormalizedTime(student, maxActivity) {
  if (maxActivity > 0) {
    return {
      ...student,
      normalized_activity_proportion: (student.total_time / maxActivity) * 100,
    };
  } else {
    return student;
  }
}
