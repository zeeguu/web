import { describe, it, expect } from "vitest";
import { execFileSync } from "child_process";
import fs from "fs";
import path from "path";

import componentsWithoutStories from "./componentsWithoutStories.json";

/**
 * Storybook is the catalog of shared UI components (see CLAUDE.md): before
 * building one, check whether it exists; if it doesn't, add it together
 * with its story. These tests keep the catalog complete.
 *
 * A shared component is a capitalized `X.js` under the folders below, or a
 * standalone `X.sc.js` (a styled primitive like Button.sc.js) with no `X.js`
 * beside it. Its story is `X.stories.js` in the same folder.
 */
const root = path.resolve(__dirname, "../..");
const SHARED_DIRS = ["src/components", "src/pages/_pages_shared"];

function sharedComponents() {
  const found = [];
  const walk = (dir) => {
    const entries = fs.readdirSync(path.join(root, dir), { withFileTypes: true });
    const names = new Set(entries.map((e) => e.name));
    for (const e of entries) {
      if (e.isDirectory()) {
        walk(`${dir}/${e.name}`);
        continue;
      }
      const m = e.name.match(/^([A-Z][A-Za-z0-9]*)(\.sc)?\.jsx?$/);
      if (!m) continue;
      const [, base, sc] = m;
      if (sc && (names.has(`${base}.js`) || names.has(`${base}.jsx`))) continue;
      found.push({ file: `${dir}/${e.name}`, hasStory: names.has(`${base}.stories.js`) });
    }
  };
  SHARED_DIRS.forEach(walk);
  return found;
}

describe("Storybook catalog", () => {
  const components = sharedComponents();
  const known = new Set(componentsWithoutStories);

  it("every new shared component comes with a story", () => {
    const missing = components.filter((c) => !c.hasStory && !known.has(c.file)).map((c) => c.file);
    // Add X.stories.js next to the component. Don't add it to
    // componentsWithoutStories.json: that list only holds components that
    // predate the catalog, and only shrinks.
    expect(missing).toEqual([]);
  });

  it("componentsWithoutStories.json only lists components that still lack a story", () => {
    const stillMissing = new Set(components.filter((c) => !c.hasStory).map((c) => c.file));
    const stale = componentsWithoutStories.filter((f) => !stillMissing.has(f));
    // These got a story (or were removed): delete them from the list.
    expect(stale).toEqual([]);
  });

  it("the Icons page lists the icons the code uses", () => {
    // Fails when an icon was added or removed without `npm run icons:gallery`.
    expect(() =>
      execFileSync("node", [path.join(root, "scripts/generate-icon-gallery.js"), "--check"], { stdio: "pipe" }),
    ).not.toThrow();
  });
});
