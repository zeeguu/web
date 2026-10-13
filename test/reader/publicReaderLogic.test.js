import { describe, it, expect, beforeEach } from "vitest";
import {
  createWordMeter,
  pickTranslationTarget,
  rememberPendingSharedArticle,
  consumePendingSharedArticle,
  summaryShareUrl,
  summaryLevelPills,
} from "../../src/reader/publicArticle/publicReaderLogic";

function memoryStorage() {
  const data = {};
  return {
    getItem: (k) => (k in data ? data[k] : null),
    setItem: (k, v) => (data[k] = String(v)),
    removeItem: (k) => delete data[k],
  };
}

describe("createWordMeter", () => {
  let storage;
  beforeEach(() => (storage = memoryStorage()));

  it("allows distinct words up to the limit, and re-taps for free", () => {
    const meter = createWordMeter(storage, 2);
    expect(meter.allow("Hus")).toBe(true);
    expect(meter.allow("hus ")).toBe(true); // same word
    expect(meter.allow("bil")).toBe(true);
    expect(meter.remaining()).toBe(0);
    expect(meter.allow("tog")).toBe(false);
    expect(meter.allow("HUS")).toBe(true);
  });

  it("persists across page loads", () => {
    createWordMeter(storage, 2).allow("hus");
    expect(createWordMeter(storage, 2).remaining()).toBe(1);
  });
});

describe("pickTranslationTarget", () => {
  const supported = ["en", "da", "de", "ro"];

  it("uses the first supported browser language", () => {
    expect(pickTranslationTarget(["ro-RO", "en-US"], "da", supported)).toBe("ro");
  });

  it("skips the article's own language", () => {
    expect(pickTranslationTarget(["da-DK", "de"], "da", supported)).toBe("de");
  });

  it("falls back to English, and makes no guess for English articles", () => {
    expect(pickTranslationTarget(["xx"], "da", supported)).toBe("en");
    expect(pickTranslationTarget(["en-GB"], "en", supported)).toBe(null);
  });
});

describe("pending shared article", () => {
  it("round-trips once", () => {
    const storage = memoryStorage();
    rememberPendingSharedArticle(storage, "/read/k3Xq9pLm2a", 0);
    expect(consumePendingSharedArticle(storage, 1000)).toBe("/read/k3Xq9pLm2a");
    expect(consumePendingSharedArticle(storage, 1000)).toBe(null);
  });

  it("expires after a day", () => {
    const storage = memoryStorage();
    rememberPendingSharedArticle(storage, "/read/k3Xq9pLm2a", 0);
    expect(consumePendingSharedArticle(storage, 25 * 3600 * 1000)).toBe(null);
  });

  it("refuses anything but a reader path", () => {
    const storage = memoryStorage();
    rememberPendingSharedArticle(storage, "https://evil.example/", 0);
    expect(consumePendingSharedArticle(storage, 1)).toBe(null);
  });
});

describe("summaryShareUrl", () => {
  it("links the summary page with the sharer's level", () => {
    expect(summaryShareUrl("aB3dE5gH7j", "A2")).toBe("https://zeeguu.org/read/aB3dE5gH7j/summary?level=A2");
  });

  it("leaves the level out when there is none", () => {
    expect(summaryShareUrl("aB3dE5gH7j", undefined)).toBe("https://zeeguu.org/read/aB3dE5gH7j/summary");
  });
});

describe("consumePendingSharedArticle after signing up from a summary", () => {
  it("returns to the summary page, level included", () => {
    const storage = memoryStorage();
    rememberPendingSharedArticle(storage, "/read/aB3dE5gH7j/summary?level=A2");
    expect(consumePendingSharedArticle(storage)).toBe("/read/aB3dE5gH7j/summary?level=A2");
  });

  it("still refuses anything else", () => {
    const storage = memoryStorage();
    rememberPendingSharedArticle(storage, "/read/aB3dE5gH7j/summary?next=//evil.example");
    expect(consumePendingSharedArticle(storage)).toBe(null);
  });
});

describe("summaryLevelPills", () => {
  const levels = [
    { level: "A2", original: false },
    { level: "B1", original: false },
    { level: "B2", original: true },
  ];

  it("labels the article's own summary as the original", () => {
    const { options } = summaryLevelPills(levels, "summary", "B2");
    expect(options.map((o) => o.pillLabel)).toEqual(["A2", "B1", "B2 · Original"]);
    expect(options.map((o) => o.level)).toEqual(["A2", "B1", "B2"]);
  });

  it("selects the level on screen", () => {
    expect(summaryLevelPills(levels, "summary:17", "A2").selected).toBe("A2");
    expect(summaryLevelPills(levels, "summary", "B2").selected).toBe("original");
  });

  it("names an original without a level plainly", () => {
    const { options } = summaryLevelPills([{ level: null, original: true }], "summary", null);
    expect(options[0].pillLabel).toBe("Original");
  });
});
