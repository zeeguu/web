import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { List } from "linked-list";
import { Word } from "../../src/reader/LinkedWordListClass";
import TranslatableWord from "../../src/reader/TranslatableWord";

/**
 * The seam markers that replaced the unlabelled chain icon (#1258): one per
 * join the learner made, each breaking only that join.
 */

const tok = (text, token_i, extra = {}) => ({ text, token_i, sent_i: 0, paragraph_i: 0, has_space: true, ...extra });

const harFundetEtStykke = () => {
  const w = new Word(tok("har", 1, { mwe_group_id: "g1" }));
  w.word = "har fundet et stykke";
  w.total_tokens = 4;
  w.mergedTokens = [
    tok("har", 1, { mwe_group_id: "g1" }),
    tok("fundet", 2, { mwe_group_id: "g1" }),
    tok("et", 3, { mwe_group_id: "g2" }),
    tok("stykke", 4, { mwe_group_id: "g2" }),
  ];
  w.dropMWEIdentity();
  w.translation = "has found a piece";
  w.bookmark_id = 99;
  w.isTranslationVisible = true;
  List.from([w]);
  return w;
};

const interactiveTextFor = () => ({
  api: { deleteBookmark: vi.fn((id, onSuccess) => onSuccess("OK")) },
  translate: vi.fn(),
});

const renderWord = (word, interactiveText, extra = {}) =>
  render(
    <TranslatableWord
      interactiveText={interactiveText}
      word={word}
      wordUpdated={vi.fn()}
      translating={true}
      pronouncing={false}
      {...extra}
    />,
  );

describe("seam markers", () => {
  it("puts one marker at the join the learner made, none inside the groups", () => {
    renderWord(harFundetEtStykke(), interactiveTextFor());

    expect(screen.getAllByRole("button", { name: "Unlink here" })).toHaveLength(1);
  });

  it("breaks at that join: deletes the fused bookmark, re-translates each piece without re-fusing", () => {
    const word = harFundetEtStykke();
    const text = interactiveTextFor();
    const wordUpdated = vi.fn();
    renderWord(word, text, { wordUpdated });

    fireEvent.click(screen.getByRole("button", { name: "Unlink here" }));

    expect(text.api.deleteBookmark).toHaveBeenCalledWith(99, expect.any(Function), expect.any(Function));
    const translated = text.translate.mock.calls.map(([w, fuse]) => [w.word, w.mweExpression, fuse]);
    expect(translated).toEqual([
      ["har fundet", "har fundet", false],
      ["et stykke", "et stykke", false],
    ]);
    expect(wordUpdated).toHaveBeenCalled();
  });

  it("shows no markers in the read-only reader", () => {
    const text = { ...interactiveTextFor(), readOnly: true };
    renderWord(harFundetEtStykke(), text);

    expect(screen.queryByRole("button", { name: "Unlink here" })).toBeNull();
  });

  it("shows no markers on a detector expression the learner has not widened", () => {
    const w = new Word(tok("har", 1, { mwe_group_id: "g1" }));
    w.word = "har fundet";
    w.mergedTokens = [tok("har", 1, { mwe_group_id: "g1" }), tok("fundet", 2, { mwe_group_id: "g1" })];
    w.translation = "has found";
    w.isTranslationVisible = true;
    renderWord(w, interactiveTextFor());

    expect(screen.queryByRole("button", { name: "Unlink here" })).toBeNull();
  });
});

describe("tapping a translated word", () => {
  const translated = () => {
    const w = new Word(tok("skib", 7));
    w.translation = "ship";
    w.isTranslationVisible = true;
    return w;
  };

  it("hides its translation, and shows it again on the next tap", () => {
    renderWord(translated(), interactiveTextFor());
    expect(screen.getByText("ship")).toBeTruthy();

    fireEvent.click(screen.getByText("skib"));
    expect(screen.queryByText("ship")).toBeNull();

    fireEvent.click(screen.getByText("skib"));
    expect(screen.getByText("ship")).toBeTruthy();
  });

  it("offers no eye icon to do the same", () => {
    const { container } = renderWord(translated(), interactiveTextFor());
    expect(container.querySelector("z-tran .hide")).toBeNull();
  });
});

describe("in an exercise", () => {
  const inExercise = () => ({ ...interactiveTextFor(), isExercise: () => true });

  it("shows no seam markers on the revealed answer, which is the bookmark being practised", () => {
    renderWord(harFundetEtStykke(), inExercise());

    expect(screen.queryByRole("button", { name: "Unlink here" })).toBeNull();
  });

  it("does not hide the revealed answer when it is tapped", () => {
    const w = new Word(tok("skib", 7));
    w.translation = "ship";
    w.isTranslationVisible = true;
    renderWord(w, inExercise());

    fireEvent.click(screen.getByText("skib"));

    expect(screen.getByText("ship")).toBeTruthy();
  });
});

describe("breaking a seam", () => {
  it("ignores a second tap while the first is still in flight", () => {
    const text = interactiveTextFor();
    text.api.deleteBookmark = vi.fn(); // never answers
    renderWord(harFundetEtStykke(), text);
    const marker = screen.getByRole("button", { name: "Unlink here" });

    fireEvent.click(marker);
    fireEvent.click(marker);

    expect(text.api.deleteBookmark).toHaveBeenCalledTimes(1);
  });
});

describe("the underline under a translated word", () => {
  it("stops at the word, leaving the space after it outside", () => {
    const w = new Word(tok("skib", 7));
    w.translation = "ship";
    w.isTranslationVisible = true;
    const { container } = renderWord(w, interactiveTextFor());

    expect(container.querySelector("z-orig > span").textContent).toBe("skib");
    expect(container.querySelector("z-orig").textContent).toBe("skib ");
  });
});

describe("a piece waiting for its translation after a break", () => {
  const pending = () => {
    const w = new Word(tok("stykke", 4));
    w.isPendingTranslation = true;
    return w;
  };

  it("keeps a blinking chip above it, so the row does not jump", () => {
    const { container } = renderWord(pending(), interactiveTextFor());

    expect(container.querySelector("z-tran.pending")).not.toBeNull();
    expect(container.querySelector("z-orig").textContent).toBe("stykke ");
  });

  it("ignores taps, which would fuse it back onto its neighbour", () => {
    const text = interactiveTextFor();
    renderWord(pending(), text);

    fireEvent.click(screen.getByText("stykke"));

    expect(text.translate).not.toHaveBeenCalled();
  });

  it("drops the chip once the translation is in", () => {
    const w = pending();
    w.translation = "piece";
    w.isTranslationVisible = true;
    const { container } = renderWord(w, interactiveTextFor());

    expect(container.querySelector("z-tran.pending")).toBeNull();
    expect(screen.getByText("piece")).toBeTruthy();
  });

  it("marks both pieces as waiting, and lets go of one whose translation fails", () => {
    const text = interactiveTextFor();
    const settled = [];
    text.translate = vi.fn((piece, fuse, onSuccess, onFusion, onError) => {
      expect(piece.isPendingTranslation).toBe(true);
      settled.push(piece);
      piece.word === "har fundet" ? onError() : onSuccess();
    });
    renderWord(harFundetEtStykke(), text);

    fireEvent.click(screen.getByRole("button", { name: "Unlink here" }));

    expect(settled.map((p) => [p.word, p.isPendingTranslation])).toEqual([
      ["har fundet", false],
      ["et stykke", false],
    ]);
  });
});
