import { describe, expect, it } from "vitest";
import { takesFeedback } from "../../src/dailyAudio/LessonFeedbackBox";

describe("takesFeedback", () => {
  it("follows the API's takes_feedback, at any level", () => {
    expect(takesFeedback({ takes_feedback: true, cefr_level: "B1" })).toBe(true);
    expect(takesFeedback({ takes_feedback: false, cefr_level: "A0" })).toBe(false);
  });

  it("falls back to A0 only when the API does not send it (before api#1000)", () => {
    expect(takesFeedback({ cefr_level: "A0" })).toBe(true);
    expect(takesFeedback({ cefr_level: "B1" })).toBe(false);
  });
});
