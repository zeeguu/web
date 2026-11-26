import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

import TranslateHistory from "../../src/translate/TranslateHistory";
import { APIContext } from "../../src/contexts/APIContext";
import { UserContext } from "../../src/contexts/UserContext";
import { SpeechContext } from "../../src/contexts/SpeechContext";

let mockedShortTexts = { texts: [], error: "", hasMore: false, loadMore: vi.fn(), forget: vi.fn() };

vi.mock("../../src/texts/useShortTexts", () => ({
  default: () => mockedShortTexts,
}));

function renderHistory({ texts = [], searches = [], hasMoreTexts = false, loadMoreTexts = vi.fn() } = {}) {
  mockedShortTexts = {
    texts,
    error: "",
    hasMore: hasMoreTexts,
    loadMore: loadMoreTexts,
    forget: vi.fn(),
  };
  const api = {
    getTranslationHistory: vi.fn().mockResolvedValue(searches),
  };
  return {
    api,
    ...render(
      <MemoryRouter>
        <APIContext.Provider value={api}>
          <UserContext.Provider value={{ userDetails: { learned_language: "da" } }}>
            <SpeechContext.Provider value={{ language: "da" }}>
              <TranslateHistory />
            </SpeechContext.Provider>
          </UserContext.Provider>
        </APIContext.Provider>
      </MemoryRouter>,
    ),
  };
}

describe("TranslateHistory", () => {
  it("highlights translated words via non-interactive TranslatableText without showing translation chips", async () => {
    const { container } = renderHistory({
      texts: [
        {
          id: 1,
          language: "da",
          last_opened_at: "2026-11-26T10:00:00",
          preview: "I aften er månen fuld.",
          tokenized_paragraphs: [
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
      ],
    });

    const translated = await screen.findByText("månen");
    expect(translated.closest("z-orig")).toBeTruthy();
    expect(container.querySelector("z-tran")).toBeNull();

    fireEvent.click(translated);
    expect(container.querySelector("z-tran")).toBeNull();
  });

  it("falls back to plain preview when there are no bookmarks", async () => {
    renderHistory({
      texts: [
        {
          id: 2,
          language: "da",
          last_opened_at: "2026-11-26T10:00:00",
          preview: "Ingen oversatte ord.",
          past_bookmarks: [],
        },
      ],
    });

    expect(await screen.findByText("Ingen oversatte ord.")).toBeTruthy();
  });

  it("shows Load more and fetches the next page when more items are available", async () => {
    const loadMoreTexts = vi.fn().mockResolvedValue();
    const searches = Array.from({ length: 20 }, (_, i) => ({
      id: i + 1,
      search_word: `ord-${i + 1}`,
      search_time: `2026-11-26T10:${String(59 - i).padStart(2, "0")}:00`,
    }));

    const { api } = renderHistory({ searches, hasMoreTexts: true, loadMoreTexts });
    const button = await screen.findByRole("button", { name: "Load more" });
    fireEvent.click(button);

    await waitFor(() => expect(button.disabled).toBe(false));
    expect(api.getTranslationHistory).toHaveBeenCalledWith(20, 20);
    expect(loadMoreTexts).toHaveBeenCalledTimes(1);
  });
});
