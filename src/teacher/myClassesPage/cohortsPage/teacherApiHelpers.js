//This function is used to set each students data relative to the other students' data for the studentActivityBar to be rendered correctly.
export function transformStudents(students) {
  let maxActivity = 0;

  let transformedStudents = students.map((student) => {
    const { reading_time, exercise_time } = student;
    const reading_percentage = getReadingPercentage(
      reading_time,
      exercise_time
    );
    const total_time = reading_time + exercise_time;

    maxActivity = maxActivity > total_time ? maxActivity : total_time;
    return {
      ...student,
      reading_percentage,
      total_time,
    };
  });
  if (maxActivity > 240) {
    transformedStudents = transformedStudents.map((student) =>
      addTotalAndNormalizedTime(student, maxActivity)
    );
  }
  return transformedStudents;
}

/**
 * Computes the proportion between two numbers
 * @param {number} a the total amount of reading time
 * @param {number} b the total amount of exercises time
 */
export function getReadingPercentage(a, b) {
  //student has done both reading and exercises -> return % of reading time
  if (!(a === 0 && b === 0)) {
    return (100 * a) / (b + a);
    //student has done no reading and no exercises:
  } else if (a === 0 && b === 0) {
    return 0;
    //student has done no reading:
  } else if (a === 0) {
    return 0;
    //student has done reading only (no exercises)
  } else {
    return 100;
  }
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
