import { describe, it, expect, vi } from "vitest";
import { render, screen, waitFor, fireEvent, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";

import { APIContext } from "../../src/contexts/APIContext";
import ArticlePreview from "../../src/articles/ArticlePreview";

/**
 * Hide from feed, with Undo, and Report, from an article card.
 *
 * In the feed, the list owns which cards are hidden: the card reports a hide
 * (onArticleHidden) and an Undo (onArticleUnhidden). Without those callbacks,
 * e.g. on a page that isn't the feed, the card hides and restores itself.
 */
describe("Article card: Hide and Report", () => {
  const ARTICLE = { id: 7, title: "Quiz: which capital is this?", summary: "", topics_list: [], source_id: 70 };
  const title = ARTICLE.title;

  function setup({ inFeed = true, unhideFails = false, holdReport = false } = {}) {
    const calls = [];
    let releaseReport;
    // Anything the card asks for that these tests don't care about is a no-op.
    const api = new Proxy(
      {
        hideArticle: vi.fn((id, cb) => {
          calls.push(["hide", id]);
          cb("OK");
        }),
        unhideArticle: vi.fn((id, cb, onError) => {
          calls.push(["unhide", id]);
          unhideFails ? onError("network") : cb("OK");
        }),
        reportBrokenArticle: vi.fn((id, reason, cb) => {
          calls.push(["report", id, reason]);
          releaseReport = () => cb({ status: "success" });
          if (!holdReport) releaseReport();
        }),
      },
      { get: (target, key) => (key in target ? target[key] : () => {}) },
    );
    const feed = inFeed ? { onArticleHidden: vi.fn(), onArticleUnhidden: vi.fn() } : {};
    render(
      <MemoryRouter>
        <APIContext.Provider value={api}>
          <ArticlePreview article={{ ...ARTICLE }} interactive {...feed} />
          <ToastContainer pauseOnFocusLoss={false} pauseOnHover={false} />
        </APIContext.Provider>
      </MemoryRouter>,
    );
    return { calls, ...feed, releaseReport: () => act(() => releaseReport()) };
  }

  async function openMenu() {
    await userEvent.click(screen.getByRole("button", { name: "More actions" }));
  }

  async function hideViaMenu() {
    await openMenu();
    await userEvent.click(screen.getByText("Hide from feed"));
  }

  async function reportNotAnArticle() {
    await openMenu();
    await userEvent.click(screen.getByText("Report…"));
    await userEvent.click(await screen.findByText(/Not an article/));
    await userEvent.click(screen.getByRole("button", { name: "send" }));
  }

  const undoButton = () => screen.findByRole("button", { name: "Undo" });

  it("in the feed: hiding tells the list, and Undo tells it again", async () => {
    const { calls, onArticleHidden, onArticleUnhidden } = setup();
    await hideViaMenu();
    await waitFor(() => expect(onArticleHidden).toHaveBeenCalledWith(7));

    await userEvent.click(await undoButton());
    expect(calls).toEqual([
      ["hide", 7],
      ["unhide", 7],
    ]);
    expect(onArticleUnhidden).toHaveBeenCalledWith(7);
  });

  it("outside the feed: the card hides itself, and Undo brings it back", async () => {
    setup({ inFeed: false });
    await hideViaMenu();
    await waitFor(() => expect(screen.queryByText(title)).not.toBeInTheDocument());

    await userEvent.click(await undoButton());
    await waitFor(() => expect(screen.getByText(title)).toBeInTheDocument());
  });

  it("a second tap while hiding doesn't hide twice", async () => {
    const { calls } = setup({ inFeed: false });
    await hideViaMenu();
    await hideViaMenu().catch(() => {}); // the menu may already be gone
    expect(calls.filter(([what]) => what === "hide")).toHaveLength(1);
    expect(screen.getAllByRole("button", { name: "Undo" })).toHaveLength(1);
  });

  it("if Undo fails, it says so and the article stays hidden", async () => {
    const { onArticleUnhidden } = setup({ unhideFails: true });
    await hideViaMenu();
    await userEvent.click(await undoButton());
    expect(await screen.findByText(/Couldn't undo/)).toBeInTheDocument();
    expect(onArticleUnhidden).not.toHaveBeenCalled();
  });

  it("Report sends the reason, and hides the card once the thank-you closes", async () => {
    const { calls, onArticleHidden } = setup();
    await reportNotAnArticle();

    expect(calls).toEqual([["report", 7, "Not an article (quiz, ad, list…)"]]);
    // The thank-you is up, and the card is still there under it.
    expect(screen.getByText(/Thank you for your report/)).toBeInTheDocument();
    expect(onArticleHidden).not.toHaveBeenCalled();

    await waitFor(() => expect(onArticleHidden).toHaveBeenCalledWith(7), { timeout: 3000 });
    expect(calls.map(([what]) => what)).toEqual(["report", "hide"]);
    expect(await screen.findByText(/reported and hidden/)).toBeInTheDocument();
  });

  it("a report that lands after the dialog was closed still hides the card", async () => {
    const { calls, onArticleHidden, releaseReport } = setup({ holdReport: true });
    await reportNotAnArticle();
    act(() => fireEvent.keyDown(screen.getByRole("dialog"), { key: "Escape" }));
    expect(calls.map(([what]) => what)).toEqual(["report"]);

    releaseReport();
    await waitFor(() => expect(onArticleHidden).toHaveBeenCalledWith(7));
  });
});
