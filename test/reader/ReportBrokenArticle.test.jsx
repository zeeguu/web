import { describe, it, expect, vi } from "vitest";
import { render, screen, act, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { APIContext } from "../../src/contexts/APIContext";
import { ReportBrokenArticleDialog, composeReportText } from "../../src/reader/ReportBrokenArticle";

/**
 * Reporting an article, e.g. a quiz that the crawler took for an article. The
 * quick reasons exist so that case is one tap.
 */
describe("composeReportText", () => {
  it("is the reason, then any detail", () => {
    expect(composeReportText("Wrong language", "it's Swedish")).toBe("Wrong language: it's Swedish");
  });

  it("works with only one of the two", () => {
    expect(composeReportText("Behind a paywall", "  ")).toBe("Behind a paywall");
    expect(composeReportText(null, "photos only")).toBe("photos only");
  });
});

describe("ReportBrokenArticleDialog", () => {
  function setup({ onReported = () => {}, onClose = () => {}, respond = true } = {}) {
    let reply;
    const api = {
      USER_FEEDBACK: "USER_FEEDBACK",
      logUserActivity: vi.fn(),
      reportBrokenArticle: vi.fn((id, reason, callback) => {
        reply = () => callback({ status: "success" });
        if (respond) reply();
      }),
    };
    render(
      <APIContext.Provider value={api}>
        <ReportBrokenArticleDialog articleID={42} open onClose={onClose} onReported={onReported} />
      </APIContext.Provider>,
    );
    return { api, reply: () => act(() => reply()) };
  }

  const send = () => screen.getByRole("button", { name: "send" });

  it("can't be sent empty", () => {
    setup();
    expect(send()).toBeDisabled();
  });

  it("a picked reason is enough to send", async () => {
    const { api } = setup();
    await userEvent.click(screen.getByText(/Not an article/));
    await userEvent.click(send());
    expect(api.reportBrokenArticle.mock.calls[0].slice(0, 2)).toEqual([42, "Not an article (quiz, ad, list…)"]);
  });

  it("shows the picked reason as selected, and a second tap unpicks it", async () => {
    setup();
    const pill = screen.getByText(/Behind a paywall/);
    await userEvent.click(pill);
    expect(pill).toHaveAttribute("aria-pressed", "true");
    await userEvent.click(pill);
    expect(pill).toHaveAttribute("aria-pressed", "false");
    expect(send()).toBeDisabled();
  });

  it("tells the caller as soon as the report is in, then closes after the thank-you", async () => {
    const onReported = vi.fn();
    const onClose = vi.fn();
    setup({ onReported, onClose });
    await userEvent.click(screen.getByText(/Wrong language/));

    vi.useFakeTimers();
    try {
      act(() => send().click());
      expect(screen.getByText(/Thank you for your report/)).toBeInTheDocument();
      expect(onReported).toHaveBeenCalledTimes(1);
      expect(onClose).not.toHaveBeenCalled();
      act(() => vi.advanceTimersByTime(2000));
      expect(onClose).toHaveBeenCalledTimes(1);
      expect(onClose).toHaveBeenCalledWith({ reported: true });
    } finally {
      vi.useRealTimers();
    }
  });

  it("closing without sending says nothing was reported", () => {
    const onClose = vi.fn();
    setup({ onClose });
    act(() => fireEvent.keyDown(screen.getByRole("dialog"), { key: "Escape" }));
    expect(onClose).toHaveBeenCalledWith({ reported: false });
  });

  it("closing early cancels the thank-you's own close", async () => {
    // Otherwise the stale timer would close the dialog again if it was reopened.
    const onClose = vi.fn();
    setup({ onClose });
    await userEvent.click(screen.getByText(/Wrong language/));

    vi.useFakeTimers();
    try {
      act(() => send().click());
      act(() => fireEvent.keyDown(screen.getByRole("dialog"), { key: "Escape" }));
      act(() => vi.advanceTimersByTime(2000));
      expect(onClose).toHaveBeenCalledTimes(1);
    } finally {
      vi.useRealTimers();
    }
  });
});
