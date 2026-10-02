import { describe, it, expect, vi } from "vitest";
import { render, screen, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { APIContext } from "../../src/contexts/APIContext";
import { ReportBrokenArticleDialog } from "../../src/reader/ReportBrokenArticle";

/**
 * Reporting an article from its card's overflow menu, e.g. a quiz that the
 * crawler took for an article. The quick reasons exist so that case is one tap;
 * what reaches the API is the reason, then any detail the learner typed.
 */
describe("ReportBrokenArticleDialog", () => {
  function setup({ onReported = () => {} } = {}) {
    const api = {
      USER_FEEDBACK: "USER_FEEDBACK",
      logUserActivity: vi.fn(),
      reportBrokenArticle: vi.fn((id, reason, callback) =>
        callback({ status: "success", marked_as_broken: false, is_teacher: false }),
      ),
    };
    render(
      <APIContext.Provider value={api}>
        <ReportBrokenArticleDialog articleID={42} UMR_SOURCE="TEST" open onClose={() => {}} onReported={onReported} />
      </APIContext.Provider>,
    );
    return api;
  }

  const send = () => screen.getByRole("button", { name: "send" });

  it("can't be sent empty", () => {
    setup();
    expect(send()).toBeDisabled();
  });

  it("sends a picked reason on its own", async () => {
    const api = setup();
    await userEvent.click(screen.getByText(/Not an article/));
    expect(send()).toBeEnabled();

    await userEvent.click(send());
    expect(api.reportBrokenArticle.mock.calls[0][0]).toBe(42);
    expect(api.reportBrokenArticle.mock.calls[0][1]).toBe("Not an article (quiz, ad, list…)");
  });

  it("puts typed detail after the reason", async () => {
    const api = setup();
    await userEvent.click(screen.getByText(/Not an article/));
    await userEvent.type(screen.getByRole("textbox"), "it's a quiz");
    await userEvent.click(send());
    expect(api.reportBrokenArticle.mock.calls[0][1]).toBe("Not an article (quiz, ad, list…): it's a quiz");
  });

  it("tapping the picked reason again unpicks it", async () => {
    setup();
    await userEvent.click(screen.getByText(/Not an article/));
    await userEvent.click(screen.getByText(/Not an article/));
    expect(send()).toBeDisabled();
  });

  it("tells the caller once the report is in, after the thank-you", async () => {
    const onReported = vi.fn();
    setup({ onReported });
    await userEvent.click(screen.getByText(/Wrong language/));

    vi.useFakeTimers();
    try {
      act(() => send().click());
      expect(screen.getByText(/Thank you for your report/)).toBeInTheDocument();
      expect(onReported).not.toHaveBeenCalled();
      act(() => vi.advanceTimersByTime(2000));
      expect(onReported).toHaveBeenCalledTimes(1);
    } finally {
      vi.useRealTimers();
    }
  });
});
