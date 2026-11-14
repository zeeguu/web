import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor, act } from "@testing-library/react";
import { MemoryRouter, useLocation } from "react-router-dom";

const store = new Map();
vi.mock("@capacitor/core", () => ({ Capacitor: { getPlatform: () => "android" } }));
vi.mock("@capacitor/preferences", () => ({
  Preferences: {
    get: async ({ key }) => ({ value: store.get(key) ?? null }),
    remove: async ({ key }) => void store.delete(key),
  },
}));
vi.mock("@capacitor/app", () => ({ App: { addListener: async () => ({ remove() {} }) } }));

import usePendingShare from "../../src/hooks/usePendingShare";
import { PENDING_SHARE_KEY, SHARE_WAITING_EVENT } from "../../src/texts/pendingShare";
import { takePendingSharedText } from "../../src/texts/sharedText";

function render(loggedIn) {
  return renderHook(
    ({ loggedIn }) => {
      usePendingShare(loggedIn);
      return useLocation();
    },
    { initialProps: { loggedIn }, wrapper: ({ children }) => <MemoryRouter initialEntries={["/articles"]}>{children}</MemoryRouter> },
  );
}

describe("usePendingShare", () => {
  beforeEach(() => {
    store.clear();
    takePendingSharedText();
  });

  it("opens a text waiting at startup in /texts, once", async () => {
    store.set(PENDING_SHARE_KEY, JSON.stringify({ text: "Hej alle! Træningen er aflyst." }));

    const { result } = render(true);

    await waitFor(() => expect(result.current.pathname).toBe("/texts"));
    expect(takePendingSharedText()).toBe("Hej alle! Træningen er aflyst.");
    expect(store.has(PENDING_SHARE_KEY)).toBe(false);
  });

  it("opens a shared link as an article", async () => {
    store.set(PENDING_SHARE_KEY, JSON.stringify({ url: "https://www.dr.dk/nyheder/a" }));

    const { result } = render(true);

    await waitFor(() => expect(result.current.pathname).toBe("/shared-article"));
    expect(result.current.search).toBe("?url=" + encodeURIComponent("https://www.dr.dk/nyheder/a"));
  });

  it("keeps a share made before logging in until there is a session", async () => {
    store.set(PENDING_SHARE_KEY, JSON.stringify({ text: "Vi ses på lørdag." }));

    const { result, rerender } = render(false);
    await new Promise((r) => setTimeout(r, 20));
    expect(result.current.pathname).toBe("/articles");
    expect(store.has(PENDING_SHARE_KEY)).toBe(true);

    rerender({ loggedIn: true });
    await waitFor(() => expect(result.current.pathname).toBe("/texts"));
  });

  it("takes a share that arrives while the app runs, on the native nudge", async () => {
    const { result } = render(true);
    await new Promise((r) => setTimeout(r, 20));

    store.set(PENDING_SHARE_KEY, JSON.stringify({ text: "Husk madpakke." }));
    act(() => window.dispatchEvent(new Event(SHARE_WAITING_EVENT)));

    await waitFor(() => expect(result.current.pathname).toBe("/texts"));
    expect(takePendingSharedText()).toBe("Husk madpakke.");
  });
});
