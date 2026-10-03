import { describe, expect, it, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import useDomActivitySession from "../../src/hooks/useDomActivitySession";

describe("useDomActivitySession with startOnActivity", () => {
  // react-idle-timer fires onActive AND onAction for the first event after it
  // has gone idle; both call start() before a re-render. Used to create two
  // browsing sessions, one stuck at 0s.
  it("creates one session when the first interaction comes after going idle", async () => {
    const apiCreate = vi.fn();
    renderHook(() =>
      useDomActivitySession({
        label: "test",
        sessionKey: "da",
        idleTimeout: 50,
        startOnActivity: true,
        apiCreate,
        apiUpdate: vi.fn(),
        apiEnd: vi.fn(),
      }),
    );
    await act(() => new Promise((r) => setTimeout(r, 120)));
    act(() => {
      document.dispatchEvent(new MouseEvent("mousedown", { bubbles: true }));
    });
    expect(apiCreate).toHaveBeenCalledTimes(1);
  });
});
