// Local preview only, not committed.
import { useState } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import LessonFeedbackBox from "./dailyAudio/LessonFeedbackBox";

const api = { sendLessonFeedback: (id, aspect, value, ok) => { console.log("feedback", aspect, value); ok && ok(); } };

function Preview() {
  const [lessonData, setLessonData] = useState({
    lesson_id: 1, canonical_suggestion: "grocery shopping", situation_lesson_count: 11,
    next_situations: ["at the bakery", "asking for the price", "paying at the checkout"], feedback: {},
  });
  return (
    <div style={{ maxWidth: 600, margin: "0 auto", padding: 16, fontFamily: "sans-serif" }}>
      <div style={{ padding: 12, border: "1px solid #28a745", borderRadius: 4, color: "#28a745", fontSize: 14 }}>
        ✓ Lesson completed! Great job on finishing today's lesson.
      </div>
      <LessonFeedbackBox lessonData={lessonData} setLessonData={setLessonData} api={api} />
    </div>
  );
}
createRoot(document.getElementById("root")).render(<Preview />);
