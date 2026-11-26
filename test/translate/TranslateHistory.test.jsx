import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

import TranslateHistory from "../../src/translate/TranslateHistory";
import { APIContext } from "../../src/contexts/APIContext";
import { UserContext } from "../../src/contexts/UserContext";
import { SpeechContext } from "../../src/contexts/SpeechContext";

let mockedTexts = [];

vi.mock("../../src/texts/useShortTexts", () => ({
  default: () => ({ texts: mockedTexts, error: "", forget: vi.fn() }),
}));

function renderHistory(texts) {
  mockedTexts = texts;
  const api = {
    getTranslationHistory: vi.fn().mockResolvedValue([]),
  };
  return render(
    <MemoryRouter>
      <APIContext.Provider value={api}>
        <UserContext.Provider value={{ userDetails: { learned_language: "da" } }}>
          <SpeechContext.Provider value={{ language: "da" }}>
            <TranslateHistory />
          </SpeechContext.Provider>
        </UserContext.Provider>
      </APIContext.Provider>
    </MemoryRouter>,
  );
}

describe("TranslateHistory", () => {
  it("highlights translated words via non-interactive TranslatableText without showing translation chips", async () => {
    const { container } = renderHistory([
      {
        id: 1,
        language: "da",
        last_opened_at: "2026-11-26T10:00:00",
        preview: "I aften er månen fuld.",
        tokenized_preview: [
          [
            [
              { text: "I", sent_i: 0, token_i: 0, has_space: true },
              { text: "aften", sent_i: 0, token_i: 1, has_space: true },
              { text: "er", sent_i: 0, token_i: 2, has_space: true },
              { text: "månen", sent_i: 0, token_i: 3, has_space: true },
              { text: "fuld", sent_i: 0, token_i: 4, has_space: false },
              { text: ".", sent_i: 0, token_i: 5, is_punct: true, has_space: false },
            ],
          ],
        ],
        past_bookmarks: [
          {
            id: 42,
            origin: "månen",
            translation: "the moon",
            context_sent: 0,
            context_token: 0,
            t_sentence_i: 0,
            t_token_i: 3,
            t_total_token: 1,
            is_mwe: false,
          },
        ],
      },
    ]);

    const translated = await screen.findByText("månen");
    expect(translated.closest("z-orig")).toBeTruthy();
    expect(container.querySelector("z-tran")).toBeNull();

    // Clicking the highlighted word does not toggle a translation chip
    fireEvent.click(translated);
    expect(container.querySelector("z-tran")).toBeNull();
  });

  it("falls back to plain preview when tokenized_preview is absent", async () => {
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
