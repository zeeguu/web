import { describe, it, expect, vi } from "vitest";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";

import { APIContext } from "../../src/contexts/APIContext";
import ArticlePreview from "../../src/articles/ArticlePreview";

// react-toastify closes a toast when its CSS animations end, and jsdom never ends
// one: this plays them out -- the timer bar running down, then the exit.
function finishToastAnimations() {
  document.querySelectorAll(".Toastify__progress-bar").forEach((bar) => fireEvent.animationEnd(bar));
  document.querySelectorAll(".Toastify__toast").forEach((t) => fireEvent.animationEnd(t));
}

/**
 * Hide from feed, with Undo.
 *
 * The card stays mounted while its toast is up, so Undo can put it back where it
 * was; the feed is only told to drop it once the toast closes without Undo.
 */
describe("Hide from feed", () => {
  const ARTICLE = { id: 7, title: "Quiz: which capital is this?", summary: "", topics_list: [], source_id: 70 };
  const title = ARTICLE.title;

  function setup({ unhideFails = false, cardProps = {} } = {}) {
    const calls = [];
    // A fresh object per test: hiding marks the article object itself.
    const article = { ...ARTICLE };
    // Anything the card asks for that this test doesn't care about is a no-op.
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
          cb({ status: "success" });
        }),
      },
      { get: (target, key) => (key in target ? target[key] : () => {}) },
    );
    const onArticleHidden = vi.fn();
    const card = <ArticlePreview article={article} onArticleHidden={onArticleHidden} interactive {...cardProps} />;
    const ui = (children) => (
      <MemoryRouter>
        <APIContext.Provider value={api}>
          {children}
          <ToastContainer pauseOnFocusLoss={false} pauseOnHover={false} />
        </APIContext.Provider>
      </MemoryRouter>
    );
    const view = render(ui(card));
    // Unmount and mount the card again on the same article object, as a list
    // rebuilt from a snapshot does.
    const remount = () => {
      view.rerender(ui(null));
      view.rerender(ui(<ArticlePreview article={article} onArticleHidden={onArticleHidden} interactive />));
    };
    return { calls, onArticleHidden, remount };
  }

  async function hideViaMenu() {
    await userEvent.click(screen.getByRole("button", { name: "More actions" }));
    await userEvent.click(screen.getByText("Hide from feed"));
  }

  it("Undo brings the card back and unhides it on the server", async () => {
    const { calls, onArticleHidden } = setup();
    await hideViaMenu();
    await waitFor(() => expect(screen.queryByText(title)).not.toBeInTheDocument());

    await userEvent.click(await screen.findByRole("button", { name: "Undo" }));

    expect(calls).toEqual([
      ["hide", 7],
      ["unhide", 7],
    ]);
    await waitFor(() => expect(screen.getByText(title)).toBeInTheDocument());
    // The toast closing after an Undo must not drop the card from the feed.
    finishToastAnimations();
    await waitFor(() => expect(screen.queryByRole("button", { name: "Undo" })).not.toBeInTheDocument());
    expect(onArticleHidden).not.toHaveBeenCalled();
  });

  it("without Undo, the feed drops the card once the toast closes", async () => {
    const { onArticleHidden } = setup();
    await hideViaMenu();
    await screen.findByRole("button", { name: "Undo" });
    expect(onArticleHidden).not.toHaveBeenCalled();

    finishToastAnimations();
    await waitFor(() => expect(onArticleHidden).toHaveBeenCalledWith(7));
  });

  it("a second tap while hiding doesn't hide twice", async () => {
    const { calls } = setup();
    await hideViaMenu();
    await hideViaMenu().catch(() => {}); // the menu may already be gone
    expect(calls.filter(([what]) => what === "hide")).toHaveLength(1);
    expect(screen.getAllByRole("button", { name: "Undo" })).toHaveLength(1);
  });

  it("stays hidden if the list remounts the card while the toast is up", async () => {
    const { remount } = setup();
    await hideViaMenu();
    await screen.findByRole("button", { name: "Undo" });
    remount();
    expect(screen.queryByText(title)).not.toBeInTheDocument();
  });

  it("if Undo fails, says so and lets the feed drop the card", async () => {
    const { onArticleHidden } = setup({ unhideFails: true });
    await hideViaMenu();
    await userEvent.click(await screen.findByRole("button", { name: "Undo" }));
    expect(await screen.findByText(/Couldn't undo/)).toBeInTheDocument();
    expect(onArticleHidden).toHaveBeenCalledWith(7);
  });

  it("Report sends the reason, then hides the card once the dialog closes", async () => {
    const { calls, onArticleHidden } = setup();
    await userEvent.click(screen.getByRole("button", { name: "More actions" }));
    await userEvent.click(screen.getByText("Report…"));
    await userEvent.click(await screen.findByText(/Not an article/));
    await userEvent.click(screen.getByRole("button", { name: "send" }));

    expect(calls).toEqual([["report", 7, "Not an article (quiz, ad, list…)"]]);
    // The thank-you is still up, and the card is still there under it.
    expect(screen.getByText(/Thank you for your report/)).toBeInTheDocument();
    expect(screen.getByText(title)).toBeInTheDocument();

    await waitFor(() => expect(calls.map(([what]) => what)).toEqual(["report", "hide"]), { timeout: 3000 });
    expect(await screen.findByText(/reported and hidden/)).toBeInTheDocument();
    finishToastAnimations();
    await waitFor(() => expect(onArticleHidden).toHaveBeenCalledWith(7));
  });
});
