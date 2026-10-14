import { describe, expect, it } from "vitest";
import { storyOutlets } from "../../src/utils/misc/articleHelpers";

describe("storyOutlets", () => {
  it("lists every outlet of a multi-outlet story by domain, in API order", () => {
    const article = {
      id: 2,
      story_outlets: [
        { id: 1, url: "https://www.huffingtonpost.fr/culture/renaud" },
        { id: 2, url: "https://www.lefigaro.fr/actualite/renaud" },
      ],
    };
    expect(storyOutlets(article)).toEqual([
      { id: 1, label: "huffingtonpost.fr" },
      { id: 2, label: "lefigaro.fr" },
    ]);
  });

  it("is null for a story only one outlet ran", () => {
    expect(storyOutlets({ id: 1 })).toBeNull();
    expect(storyOutlets({ id: 1, story_outlets: [{ id: 1, url: "https://dr.dk/a" }] })).toBeNull();
  });
});
