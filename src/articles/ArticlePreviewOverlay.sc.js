import styled from "styled-components";

// Scroll region: title + meta + image + summary scroll HERE, in their own
// flex-sized area, so content never slides over the fixed footer below. The
// Modal wrapper is a flex column; this takes the remaining height and scrolls.
// It bleeds to the wrapper's side padding so the scrollbar rides the modal
// edge (not floating 48px in), while the content keeps its own side padding.
const ScrollArea = styled.div`
  flex: 1 1 auto;
  min-height: 0;
  overflow-y: auto;
  overflow-x: hidden;
  display: flex;
  flex-direction: column;
  margin: 0 -48px;
  /* Bleed to the wrapper edge (−48 cancels its 48px padding) so the scrollbar
     rides the modal edge, then re-inset the content generously. The wider
     desktop overlay needs more breathing room than the wrapper's 48px. */
  /* top: just breathing room under the header band, which now supplies the
     clearance the title used to carve out for itself. */
  padding: 1.2em 64px 1.1em;

  /* Keep an overscroll at the sheet's edges from bouncing the feed behind it —
     those two edges are where the drag-to-dismiss gesture starts. */
  overscroll-behavior: contain;

  /* Thin, quiet scrollbar instead of the chunky default. */
  scrollbar-width: thin;
  scrollbar-color: rgba(140, 140, 150, 0.45) transparent;
  &::-webkit-scrollbar {
    width: 6px;
  }
  &::-webkit-scrollbar-thumb {
    background: rgba(140, 140, 150, 0.45);
    border-radius: 3px;
  }
  &::-webkit-scrollbar-track {
    background: transparent;
  }

  @media (max-width: 576px) {
    margin: 0 -16px;
    /* No fixed footer any more, so the scroll area itself owns the bottom
       breathing room — including the home-indicator inset. */
    padding: 0.6em 16px calc(1em + env(safe-area-inset-bottom, 0px));
  }
`;

// The sheet's own top band: a fixed-height strip above the scroll area holding
// the dismiss control, and — on the phone — the grab handle. It is a flex
// SIBLING of the scroll area rather than an overlay on top of it, so scrolling
// content cannot pass under the X and collide with it: the scroll area's box
// simply starts below this band. It bleeds to the wrapper's edges (the negative
// margins cancel the wrapper's padding) so the divider spans the full width.
const Header = styled.div`
  flex: 0 0 auto;
  position: relative;
  display: flex;
  align-items: center;
  height: 52px;
  margin: -32px -48px 0;
  border-bottom: 1px solid var(--border-light);
  /* This band is a drag surface, so no browser panning/zooming on it. */
  touch-action: none;

  @media (max-width: 576px) {
    height: 44px;
    margin: -20px -16px 0;
  }
`;

// The bottom-sheet grab handle: the conventional "you can drag this" affordance.
// Phone only — on desktop the sheet is a centered card that does not drag.
const GrabHandle = styled.div`
  position: absolute;
  left: 50%;
  top: 10px;
  transform: translateX(-50%);
  width: 36px;
  height: 4px;
  border-radius: 2px;
  background: var(--border-color);
  opacity: 0.7;

  @media (min-width: 577px) {
    display: none;
  }
`;

// Dismiss control, at the header band's LEFT edge: the conventional home for
// "back out of this", and deliberately away from the forward action at the end
// of the content.
const CloseCorner = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  /* 44px: a real touch target around a 22px glyph. */
  width: 44px;
  height: 44px;
  margin-left: 6px;
  padding: 0;
  border: none;
  border-radius: 50%;
  background: transparent;
  color: var(--text-muted);
  cursor: pointer;
  transition:
    color 150ms ease-in-out,
    background-color 150ms ease-in-out;

  @media (hover: hover) {
    &:hover {
      color: var(--text-primary);
      background-color: var(--hover-bg);
    }
  }

  @media (min-width: 577px) {
    margin-left: 10px;
  }
`;

// Interactive title. Same size as the summary below ("equally large"): the
// whole point of the overlay is comfortable per-word tapping, so nothing
// shrinks vs the card — this matters most on the phone. Weight, not size,
// distinguishes the title.
const Title = styled.div`
  font-size: 1.4em;
  font-weight: 600;
  line-height: 1.35;
  color: var(--text-primary);
`;

// Uncropped, unlike the feed card. The card sits in a list, so it crops every
// photo to one box to keep the feed even; the overlay shows a single article and
// can honour whatever ratio the publisher shipped. Auto on BOTH axes with a max
// on each is what makes the browser re-solve the box proportionally against
// whichever cap binds first — panoramas hit max-width and go short, portraits
// hit max-height and go narrow, and nothing is ever sliced off. A definite
// width (100%) would not: max-height then squashes portraits instead of
// narrowing them. Centred, since a clamped portrait is narrower than the sheet.
const Image = styled.img`
  display: block;
  width: auto;
  height: auto;
  max-width: min(100%, 32em);
  max-height: 22em;
  border-radius: 0.75em;
  margin: 0.9em auto 0.3em;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.22);
`;

// Save action inside the content (not the bottom bar): a labeled button just
// under the header, so the footer stays "Original + Close" only.
const SaveRow = styled.div`
  display: flex;
  margin: 0.7em 0 0.2em;
`;

// Small caption above the summary body making it explicit this is a summary,
// not the full article (the full text lives behind "Read full").
const SummaryLabel = styled.div`
  font-size: 0.75em;
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--text-muted);
  margin-top: 0.9em;
`;

// Interactive summary body — equally large as the title. Generous line-height
// for comfortable tapping of individual words, especially on the phone.
const Summary = styled.div`
  font-size: 1.4em;
  line-height: 1.6;
  color: var(--text-primary);
  margin-top: 0.15em;
`;

// The primary action, in the content flow at the end of the summary rather
// than in a fixed bar. Sized in rem, not em, so it keeps a constant physical
// size while the surrounding text scales with the reader's chosen size — the
// button is chrome, not reading material.
const PrimaryAction = styled.div`
  margin-top: 1.4em;
  font-size: 1rem;
`;

// The reading time, carried inside the button as supporting detail: the label
// says what the button does, this says what it costs.
const ActionHint = styled.span`
  font-weight: 400;
  opacity: 0.8;
`;

export {
  ScrollArea,
  Header,
  GrabHandle,
  CloseCorner,
  Title,
  SaveRow,
  Image,
  SummaryLabel,
  Summary,
  PrimaryAction,
  ActionHint,
};
