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
  const article = { id: 7, title: "Quiz: which capital is this?", summary: "", topics_list: [] };

  function setup() {
    const calls = [];
    // Anything the card asks for that this test doesn't care about is a no-op.
    const api = new Proxy(
      {
        hideArticle: vi.fn((id, cb) => {
          calls.push(["hide", id]);
          cb("OK");
        }),
        unhideArticle: vi.fn((id, cb) => {
          calls.push(["unhide", id]);
          cb("OK");
        }),
      },
      { get: (target, key) => (key in target ? target[key] : () => {}) },
    );
    const onArticleHidden = vi.fn();
    render(
      <MemoryRouter>
        <APIContext.Provider value={api}>
          <ArticlePreview article={article} onArticleHidden={onArticleHidden} interactive />
          <ToastContainer pauseOnFocusLoss={false} pauseOnHover={false} />
        </APIContext.Provider>
      </MemoryRouter>,
    );
    return { calls, onArticleHidden };
  }

  async function hideViaMenu() {
    await userEvent.click(screen.getByRole("button", { name: "More actions" }));
    await userEvent.click(screen.getByText("Hide from feed"));
  }

  it("Undo brings the card back and unhides it on the server", async () => {
    const { calls, onArticleHidden } = setup();
    await hideViaMenu();
    await waitFor(() => expect(screen.queryByText(article.title)).not.toBeInTheDocument());

    await userEvent.click(await screen.findByRole("button", { name: "Undo" }));

    expect(calls).toEqual([
      ["hide", 7],
      ["unhide", 7],
    ]);
    await waitFor(() => expect(screen.getByText(article.title)).toBeInTheDocument());
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

  it("offers Report next to Hide", async () => {
    setup();
    await userEvent.click(screen.getByRole("button", { name: "More actions" }));
    await userEvent.click(screen.getByText("Report…"));
    expect(await screen.findByText(/Not an article/)).toBeInTheDocument();
  });
});
