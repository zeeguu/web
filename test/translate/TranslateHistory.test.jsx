import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

import TranslateHistory from "../../src/translate/TranslateHistory";
import { APIContext } from "../../src/contexts/APIContext";
import { UserContext } from "../../src/contexts/UserContext";

let mockedTexts = [];

vi.mock("../../src/texts/useShortTexts", () => ({
  default: () => ({ texts: mockedTexts, error: "", forget: vi.fn() }),
}));

function renderHistory(texts) {
  mockedTexts = texts;
  const api = {
    getTranslationHistory: vi.fn().mockResolvedValue([]),
  };
  render(
    <MemoryRouter>
      <APIContext.Provider value={api}>
        <UserContext.Provider value={{ userDetails: { learned_language: "da" } }}>
          <TranslateHistory />
        </UserContext.Provider>
      </APIContext.Provider>
    </MemoryRouter>,
  );
}

describe("TranslateHistory", () => {
  it("highlights translated words in short-text previews when preview_parts are provided", async () => {
    renderHistory([
      {
        id: 1,
        language: "da",
        last_opened_at: "2026-11-26T10:00:00",
        preview: "I aften er månen fuld.",
        preview_parts: [
          { text: "I aften er " },
          { text: "månen", translated: true },
          { text: " fuld." },
        ],
      },
    ]);

    const highlighted = await screen.findByText("månen");
    expect(highlighted.tagName).toBe("SPAN");
    expect(screen.getByText(/I aften er/)).toBeTruthy();
  });

  it("falls back to plain preview when preview_parts are absent", async () => {
    renderHistory([
      {
        id: 2,
        language: "da",
        last_opened_at: "2026-11-26T10:00:00",
        preview: "Ingen oversatte ord.",
      },
    ]);

    expect(await screen.findByText("Ingen oversatte ord.")).toBeTruthy();
  });
});
