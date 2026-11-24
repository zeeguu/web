import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

import SharedInbox from "../../src/articles/SharedInbox";
import { SharedArticlesContext } from "../../src/contexts/SharedArticlesContext";

vi.mock("../../src/articles/SharedArticleRow", () => ({
  default: ({ share }) => <div data-testid="row">article: {share.article.title}</div>,
}));

function setup({ shares = [], hasSharesInOtherLanguages = false } = {}) {
  render(
    <MemoryRouter>
      <SharedArticlesContext.Provider
        value={{ sharedArticles: shares, sharedArticlesLoading: false, hasSharesInOtherLanguages }}
      >
        <SharedInbox />
      </SharedArticlesContext.Provider>
    </MemoryRouter>,
  );
}

describe("Inbox", () => {
  it("lists what friends shared", () => {
    setup({ shares: [{ id: 1, created_at: "2026-11-10T10:00:00", article: { title: "From Anna" } }] });
    expect(screen.getAllByTestId("row").map((r) => r.textContent)).toEqual(["article: From Anna"]);
  });

  it("says how things get here when there is nothing yet", () => {
    setup();
    expect(screen.getByText(/When a friend sends you an article/)).toBeTruthy();
  });

  it("says so when everything is in another language", () => {
    setup({ hasSharesInOtherLanguages: true });
    expect(screen.getByText(/in another language/)).toBeTruthy();
  });
});
