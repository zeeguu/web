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
| Article difficulty for a teacher | `effectiveCefrLevel()` in `utils/misc/cefrHelpers` | re-deriving from `cefr_assessments.llm/ml` |
| Flag | `DynamicFlagImage` — `size` is interpolated as a CSS length, so pass `"1rem"`, never `16` | — |
| Empty state | `EmptyState` | — |
| Switching learned language | `useGuardedLanguageSwitch` | calling `switchLanguage` directly (skips the mid-article confirmation) |

`grep -rn "styled.div" src/components` before adding one. If the closest match
is *almost* right, extend that family (as `FullWidthInfoMsg` was added beside
its two siblings) rather than starting a sixth variant.

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
setting alone.

## iOS

Wrap every `:hover` rule on a tappable element in `@media (hover: hover)`. On
iOS an unscoped hover turns into "first tap previews, second tap activates".

## Tests

Vitest, in `test/`, mirroring `src/`. Prefer extracting logic into a pure
function and testing that (see `teacher/myTextsPage/textFilters.js`) over
rendering components.
