import { describe, it, expect, beforeEach } from "vitest";
import {
  createWordMeter,
  pickTranslationTarget,
  rememberPendingSharedArticle,
  consumePendingSharedArticle,
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
    rememberPendingSharedArticle(storage, "/read/k3Xq9pLm2a.mr7Q2z", 0);
    expect(consumePendingSharedArticle(storage, 1000)).toBe("/read/k3Xq9pLm2a.mr7Q2z");
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
