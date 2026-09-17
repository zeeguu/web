import { vi } from "vitest";

// classDef imports fetch from cross-fetch, so that is what we stub.
const fetchMock = vi.fn();
vi.mock("cross-fetch", () => ({ default: (...args) => fetchMock(...args) }));

// classDef defines the transport; the named endpoint methods (getUserPreferences
// and friends) are attached to the prototype by the sibling modules. Going
// straight at _getJSONPromise keeps this about the transport.
const { Zeeguu_API, ServerUnavailableError } = await import("../../src/api/classDef");

const api = new Zeeguu_API("https://api.zeeguu.org");
api.setSession("test-session");

function respondWith(status) {
  fetchMock.mockResolvedValueOnce({
    ok: status >= 200 && status < 300,
    status,
    json: async () => ({}),
  });
}

beforeEach(() => fetchMock.mockReset());

// The bug this guards: every failure used to be converted to
// ServerUnavailableError, so a 403 ("verify your email first") reached App as
// "the server is unreachable" and raised a non-dismissable connection modal
// that short-circuited the router — hiding the /verify_email redirect the user
// needed. Unverified school accounts were locked out of Zeeguu entirely.
describe("_getJSONPromise error shapes", () => {
  test("a 403 rejects with the status, not ServerUnavailableError", async () => {
    respondWith(403);

    const error = await api._getJSONPromise("user_preferences").catch((e) => e);

    expect(error).not.toBeInstanceOf(ServerUnavailableError);
    expect(error.status).toBe(403);
  });

  test("a 401 keeps its status so callers can log the user out", async () => {
    respondWith(401);

    const error = await api._getJSONPromise("user_preferences").catch((e) => e);

    expect(error.status).toBe(401);
  });

  test("a 500 keeps its status", async () => {
    respondWith(500);

    const error = await api._getJSONPromise("user_preferences").catch((e) => e);

    expect(error.status).toBe(500);
  });

  test("a statusless fetch failure is still ServerUnavailableError", async () => {
    fetchMock.mockRejectedValueOnce(new TypeError("Failed to fetch"));

    const error = await api._getJSONPromise("user_preferences").catch((e) => e);

    expect(error).toBeInstanceOf(ServerUnavailableError);
    expect(error.status).toBeUndefined();
  });
});
