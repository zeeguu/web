import styled, { keyframes } from "styled-components";
import { orange600, successGreen, zeeguuRed } from "../../components/colors";
import { charDiff, isCloseMiss } from "../utils/charDiff";

// How long the correction plays before the exercise flips to its reveal.
// Exercises delay notifyIncorrectAnswer by this much.
export const CORRECTION_DURATION_MS = 1600;

const SETTLE_DELAY_MS = 350;
const STAGGER_MS = 90;

const collapse = keyframes`
  from { max-width: 1ch; opacity: 1; }
  to   { max-width: 0;   opacity: 0; }
`;

const grow = keyframes`
  from { max-width: 0;   opacity: 0; transform: translateY(-0.4em); }
  to   { max-width: 1ch; opacity: 1; transform: translateY(0); }
`;

const Word = styled.span`
  display: inline-block;
  font-family: monospace;
  padding: 2px 4px;
  border-bottom: 2px dotted ${orange600};
  white-space: pre;
`;

const Letter = styled.span`
  display: inline-block;
  overflow: hidden;
  vertical-align: bottom;
`;

const DeletedLetter = styled(Letter)`
  color: ${zeeguuRed};
  text-decoration: line-through;
  animation: ${collapse} 300ms ease-in ${(p) => p.$delay}ms forwards;
`;

const AddedLetter = styled(Letter)`
  color: ${successGreen};
  font-weight: 700;
  max-width: 0;
  opacity: 0;
  animation: ${grow} 300ms cubic-bezier(0.22, 1, 0.36, 1) ${(p) => p.$delay}ms forwards;
`;

const WholeWordOut = styled.span`
  color: ${zeeguuRed};
  text-decoration: line-through;
  margin-right: 0.5ch;
`;

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(-0.4em); }
  to   { opacity: 1; transform: translateY(0); }
`;

const WholeWordIn = styled.span`
  color: ${successGreen};
  font-weight: 700;
  opacity: 0;
  animation: ${fadeIn} 300ms ease-out ${SETTLE_DELAY_MS}ms forwards;
`;

/**
 * Plays the correction of a wrong typed answer in the cloze slot: wrong
 * letters are struck out and collapse, missing letters grow in green. A
 * different word altogether is struck out and the expected one fades in
 * beside it.
 */
export default function ClozeCorrection({ typed, expected }) {
  const ops = charDiff(typed, expected);

  if (!isCloseMiss(ops, expected)) {
    return (
      <Word>
        <WholeWordOut>{typed}</WholeWordOut>
        <WholeWordIn>{expected}</WholeWordIn>
      </Word>
    );
  }

  let step = 0;
  const letters = ops.map((op, i) => {
    if (op.type === "same") return <Letter key={i}>{op.ch}</Letter>;
    const delay = SETTLE_DELAY_MS + STAGGER_MS * step++;
    const Changed = op.type === "del" ? DeletedLetter : AddedLetter;
    return (
      <Changed key={i} $delay={delay}>
        {op.ch}
      </Changed>
    );
  });

  return <Word>{letters}</Word>;
}
