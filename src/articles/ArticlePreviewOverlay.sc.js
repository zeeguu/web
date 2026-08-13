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
  padding: 0 48px 0.4em; /* last line clears the footer's top border */

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
    padding: 0 16px 0.4em;
  }
`;

// Interactive title. Same size as the summary below ("equally large"): the
// whole point of the overlay is comfortable per-word tapping, so nothing
// shrinks vs the card — this matters most on the phone. Weight, not size,
// distinguishes the title.
// Settings gear, pinned to the modal's top-right corner (outside the scroll
// area so its dropdown isn't clipped). The wrapper is a positioned ancestor.
const Gear = styled.div`
  position: absolute;
  top: 8px;
  right: 10px;
  z-index: 5;
`;

const Title = styled.div`
  font-size: 1.4em;
  font-weight: 600;
  line-height: 1.35;
  color: var(--text-primary);
  padding-right: 2.4em; /* clear the top-right settings gear */
`;

// Shorter than before so the interactive text (the point of the overlay)
// starts higher and needs less scrolling. Slight shadow adds depth.
const Image = styled.img`
  width: 100%;
  max-height: 11em;
  object-fit: cover;
  border-radius: 0.75em;
  margin: 0.9em 0 0.3em;
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

// Fixed action footer: Read full / Open original / Save / Close. As a non-
// shrinking flex sibling of the scroll region it stays pinned at the bottom
// while the content scrolls above it — content never crosses it. Negative
// margins bleed the bar to the wrapper's edges (matching its padding: 48px
// sides on desktop, 16px on the mobile sheet) so it's a solid full-width strip
// flush with the bottom; the footer supplies its own bottom (safe-area) room.
const Actions = styled.div`
  flex-shrink: 0;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.6em;
  margin: 0 -48px 0;
  padding: 0.9em 48px 1.1em;
  background: var(--card-bg);
  border-top: 1px solid var(--border-subtle, rgba(128, 128, 128, 0.25));
  box-shadow: 0 -10px 14px -8px rgba(0, 0, 0, 0.3);

  @media (max-width: 576px) {
    margin: 0 -16px 0;
    padding: 0.85em 16px calc(0.85em + env(safe-area-inset-bottom, 0px));
  }
`;

export { ScrollArea, Gear, Title, SaveRow, Image, SummaryLabel, Summary, Actions };
