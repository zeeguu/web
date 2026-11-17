# Project Configuration for Claude — zeeguu/web

## Before you write a new styled component, look for the existing one

Every item below was reinvented at least once, then reverted. The cost is not
duplication for its own sake — it is that the copy silently loses behaviour the
original had (a gesture, a theme, a separator).

| Need | Use | Not |
|---|---|---|
| Message box: error / success / neutral | `FullWidthErrorMsg.sc`, `FullWidthConfirmMsg.sc`, `FullWidthInfoMsg.sc` | a new styled div with your own colours |
| Info box with icon | `Infobox` | — |
| Metadata line under a title (source, level, counts) | `ArticleStatInfo`, or `MetaStrip` + `MetaItem` directly | hand-concatenating `·` separators |
| Back navigation | `BackArrow` (also mounts `useSwipeBack`) | a text `← Back` link — it loses the swipe gesture |
| Tab bar | `TopTabs` | buttons that navigate; a nav button next to an action button reads as the page's primary action |
| Buttons | `allButtons.sc` (`StyledButton`, `OrangeRoundButton`), teacher side: `TeacherButtons.sc` | — |
| Page heading | `PageTitle` (centred, student-facing) or `TeacherPageHeading.sc` (left, dashboard) | a third `styled.h1` |
| Language name from a code | `languageName()` in `utils/misc/languageCodeToName` | `LANGUAGE_CODE_TO_NAME[c] \|\| c` |
| Article difficulty for a teacher | `effectiveCefrLevel()` in `utils/misc/articleDifficulty` | re-deriving from `cefr_assessments.llm/ml` |
| Flag | `DynamicFlagImage` — `size` is interpolated as a CSS length, so pass `"1rem"`, never `16` | — |
| Row of filter pills | `FilterRow.sc` (`$wrap` for dashboards, scrolls by default) |
| Empty state | `EmptyState` | — |
| Switching learned language | `useGuardedLanguageSwitch` | calling `switchLanguage` directly (skips the mid-article confirmation) |

For UI, look in Storybook (next section) before adding one. If the closest
match is *almost* right, extend that family (as `FullWidthInfoMsg` was added
beside its two siblings) rather than starting a sixth variant.

## Storybook is the catalog: check it before building UI

Layout that belongs to one screen (a row, a body column, a list) is local
scaffolding — write it. But a **visual primitive** — a pill, badge, banner,
button, empty state, page header, dialog, icon — almost certainly exists
already, and a second one is a cost the whole app pays. Before writing one:

1. **Look in Storybook.** `npm run storybook` (http://localhost:6006), or
   `grep -rn "title:" src --include='*.stories.js'`. Stories sit next to their
   component (`X.stories.js` beside `X.js`), so a component's story is a file
   check away. For icons, the **Icons** page shows every icon in use and the
   files using it (`src/components/Icons/iconsInUse.generated.js`).
2. If the closest match needs *more overrides than it contributes*, that is the
   base component missing a variant. Add the variant there (`Tag` gained
   `.tiny` this way), with a story for it, rather than restating its box at
   the call site.
3. If nothing fits, say so and get it agreed. Then build the component **and
   its story first**, check it in Storybook in Light and Dark, and only then
   use it in the feature.

A story renders the **real component** with fake props or data — callbacks as
`fn()` from `storybook/test`, API calls answered by a fake (see
`ReplaceExampleModal.stories.js`), states reached with a `play` function (see
`RemoveBookmarkModal.stories.js`). Never copy a component's markup into a
story: the copy drifts from the real thing and nobody notices.

`test/storybook/storyCoverage.test.js` enforces this: a new component in
`src/components/` or `src/pages/_pages_shared/` without a story fails the
tests, and so does a new icon until `npm run icons:gallery` is run.
`componentsWithoutStories.json` lists the components that predate the
catalog; it only shrinks — never add to it.

There is no need for another CSS or component library. MUI is already a
dependency for icons and modals, and styled-components carries the house look.
A third system would make "where does this live" worse, which is the actual
cause of duplication here — not a shortage of tools.

## Name styled components after what they are on this screen

`ClassList`, `ClassRow`, `TextCount`, `SwitchButton` — not `Wrapper`, `Box`,
`Inner`. The whole repo contains three generic layout exports (all `Container`)
and no `Wrapper` at all, so reaching for one is importing a habit from
somewhere else.

Two specific traps:

- A `Wrapper` whose only job is layout (centre, pad, gap) usually means the
  layout belongs to a shared component. Check `EmptyState`, `ColumnWidth.sc`
  and the page's own column before writing one.
- `Title` invites picking a heading level for its *size* — `styled.h4` because
  h2 looked too big — which quietly breaks the document outline. Either the
  heading belongs to a shared component that owns it, or it is a named part of
  this one (`ClassName`).

## Dark mode is not optional

Colours come from CSS custom properties defined twice in `src/index.css`: once
on `:root` and again under `:root[data-theme="dark"]`. A hardcoded hex is a
dark-mode bug that will not show up until someone with the dark theme opens the
page.

- **Never write a literal hex in a `.sc.js` file.** Use `var(--…)` from
  `index.css`, or a named export from `components/colors.js`.
- **Never give `var()` a fallback.** `var(--some-token, #fff)` reads as
  defensive and is the opposite: if the token name is wrong or was never
  defined, every viewer silently gets the hardcoded fallback and only dark mode
  looks broken. With no fallback a bad name produces no declaration at all, and
  you see it the moment you look at the page.
- Colours with alpha (`zeeguuRedTransparent`) work on either ground — a good
  default for tinted panels.

Surfaces are `--bg-primary` / `--bg-secondary` / `--bg-tertiary`; text is
`--text-primary` / `--text-secondary` / `--text-muted`; also `--border-color`,
`--infobox-bg`, `--success-bg`. Grep `index.css` rather than guessing — there is
no `--bg-elevated`, however plausible it sounds.

## Verify by looking, in both themes

Tests do not catch layout. Run the app and look at the screen you changed, at
desktop and at 375px, in light and dark:

```
npx vitest run test/        # unit tests
```

Dark mode is toggled by `data-theme="dark"` on the root element, not by the OS
setting alone. For a single component, Storybook's **Theme** toolbar button
does the same, faster.

## iOS

Wrap every `:hover` rule on a tappable element in `@media (hover: hover)`. On
iOS an unscoped hover turns into "first tap previews, second tap activates".

## Tests

Vitest, in `test/`, mirroring `src/`. Prefer extracting logic into a pure
function and testing that (see `teacher/myTextsPage/textFilters.js`) over
rendering components — a rule about *logic*, which is easier to get at and
faster to run outside a component than inside one.

Rendering is still the right tool when the thing worth asserting only exists
once rendered: which options a control offers, which one reads as selected,
what a click reports back. `@testing-library/react` is available for that (see
`test/components/LanguageDialectSelector.test.jsx`). It does not replace the
rule above — pull the logic out first, test it directly, and render only for
what is left.
