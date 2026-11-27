import { describe, expect, it } from "vitest";
import {
  AVATAR_PALETTES,
  AVATAR_TABS,
  DEFAULT_AVATAR_BACKGROUND_COLOR,
  DEFAULT_AVATAR_CHARACTER_COLOR,
  DEFAULT_AVATAR_CHARACTER_ID,
  findMatchingPalette,
  getAvatarOption,
  getAvatarTabForId,
  validatedAvatarBackgroundColor,
  validatedAvatarCharacterColor,
  validatedAvatarCharacterId,
} from "../../src/profile/avatarOptions";

describe("avatarOptions", () => {
  it("validates IDs across all four tabs and falls back to default for unknown IDs", () => {
    expect(validatedAvatarCharacterId("elephant-beret")).toBe("elephant-beret");
    expect(validatedAvatarCharacterId("colibri")).toBe("colibri");
    expect(validatedAvatarCharacterId("butterfly")).toBe("butterfly");
    expect(validatedAvatarCharacterId("swan")).toBe("swan");
    expect(validatedAvatarCharacterId("cat")).toBe("cat");
    expect(validatedAvatarCharacterId("giraffe")).toBe("giraffe");
    expect(validatedAvatarCharacterId("hippo")).toBe("hippo");
    expect(validatedAvatarCharacterId("zeeguu-reader")).toBe("zeeguu-reader");
    expect(validatedAvatarCharacterId("zeeguu-blossom")).toBe("zeeguu-blossom");
    expect(validatedAvatarCharacterId("zeeguu-kimono")).toBe("zeeguu-kimono");
    expect(validatedAvatarCharacterId("watercolor-dragonfly")).toBe("watercolor-dragonfly");
    expect(validatedAvatarCharacterId("watercolor-butterfly")).toBe("watercolor-butterfly");
    expect(validatedAvatarCharacterId("watercolor-cat")).toBe("watercolor-cat");
    expect(validatedAvatarCharacterId("watercolor-giraffe")).toBe("watercolor-giraffe");
    expect(validatedAvatarCharacterId("watercolor-hippo")).toBe("watercolor-hippo");
    expect(validatedAvatarCharacterId("otter")).toBe("otter");
    expect(validatedAvatarCharacterId("unknown-avatar")).toBe(DEFAULT_AVATAR_CHARACTER_ID);
    expect(validatedAvatarCharacterId("toString")).toBe(DEFAULT_AVATAR_CHARACTER_ID);
    expect(validatedAvatarCharacterId("constructor")).toBe(DEFAULT_AVATAR_CHARACTER_ID);
    expect(validatedAvatarCharacterId(null)).toBe(DEFAULT_AVATAR_CHARACTER_ID);
  });

  it("maps each avatar ID to the right tab and rendering kind", () => {
    expect(getAvatarTabForId("colibri")).toBe("mascots");
    expect(getAvatarOption("colibri").kind).toBe("image");

    expect(getAvatarTabForId("zeeguu-reader")).toBe("zeeguu");
    expect(getAvatarOption("zeeguu-reader").kind).toBe("zeeguu");

    expect(getAvatarTabForId("watercolor-owl")).toBe("watercolors");
    expect(getAvatarOption("watercolor-owl").kind).toBe("image");

    expect(getAvatarTabForId("otter")).toBe("classic");
    expect(getAvatarOption("otter").kind).toBe("silhouette");
  });

  it("accepts both curated palette hexes and legacy saved hexes", () => {
    for (const palette of AVATAR_PALETTES) {
      expect(validatedAvatarCharacterColor(palette.characterColor)).toBe(palette.characterColor);
      expect(validatedAvatarBackgroundColor(palette.backgroundColor)).toBe(palette.backgroundColor);
      expect(findMatchingPalette(palette.characterColor, palette.backgroundColor)?.id).toBe(palette.id);
    }

    // Legacy user colors must continue rendering without resetting.
    expect(validatedAvatarCharacterColor("#f09000")).toBe("#f09000");
    expect(validatedAvatarBackgroundColor("#ffe0b3")).toBe("#ffe0b3");
    expect(validatedAvatarCharacterColor("#0d1a63")).toBe("#0D1A63");
    expect(findMatchingPalette("#f09000", "#ffe0b3")).toBeNull();

    // Unknown colors fall back to defaults.
    expect(validatedAvatarCharacterColor("#123456")).toBe(DEFAULT_AVATAR_CHARACTER_COLOR);
    expect(validatedAvatarBackgroundColor("#abcdef")).toBe(DEFAULT_AVATAR_BACKGROUND_COLOR);
  });

  it("exposes all four picker tabs with non-empty unique avatar IDs", () => {
    expect(AVATAR_TABS.map((t) => t.id)).toEqual(["mascots", "zeeguu", "watercolors", "classic"]);
    const allIds = AVATAR_TABS.flatMap((t) => t.items.map((item) => item.id));
    expect(new Set(allIds).size).toBe(allIds.length);
  });
});
