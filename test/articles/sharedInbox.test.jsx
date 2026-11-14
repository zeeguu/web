import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

import SharedInbox from "../../src/articles/SharedInbox";
import { APIContext } from "../../src/contexts/APIContext";
import { SharedArticlesContext } from "../../src/contexts/SharedArticlesContext";

vi.mock("../../src/articles/SharedArticleRow", () => ({
  default: ({ share }) => <div data-testid="row">article: {share.article.title}</div>,
}));

function setup({ shares = [], texts = [] } = {}) {
  const api = { getShortTexts: vi.fn((ok) => ok(texts)) };
  render(
    <MemoryRouter>
      <APIContext.Provider value={api}>
        <SharedArticlesContext.Provider
          value={{ sharedArticles: shares, sharedArticlesLoading: false, hasSharesInOtherLanguages: false }}
        >
          <SharedInbox />
        </SharedArticlesContext.Provider>
      </APIContext.Provider>
    </MemoryRouter>,
  );
}

describe("Inbox", () => {
  it("lists what friends shared and the learner's own texts together, newest first", () => {
    setup({
      shares: [{ id: 1, created_at: "2026-11-10T10:00:00", article: { title: "From Anna" } }],
      texts: [
        { id: 7, preview: "Hej, kommer du i aften?", language: "da", last_opened_at: "2026-11-12T10:00:00" },
        { id: 8, preview: "Husk mødet", language: "da", last_opened_at: "2026-11-01T10:00:00" },
      ],
    });
    const rows = [...document.querySelectorAll("[role=button], [data-testid=row]")].map((r) => r.textContent);
    expect(rows[0]).toMatch(/Hej, kommer du i aften\?/);
    expect(rows[0]).toMatch(/Shared by you/);
    expect(rows[1]).toBe("article: From Anna");
    expect(rows[2]).toMatch(/Husk mødet/);
  });

  it("says how things get here when there is nothing yet", () => {
    setup();
    expect(screen.getByText(/Share a text or an article from another app/)).toBeTruthy();
    expect(screen.getByText("Paste from clipboard")).toBeTruthy();
  });
});
