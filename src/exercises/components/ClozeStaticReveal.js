import { orange500 } from "../../components/colors";

/**
 * Static cloze placeholder that shows an underline during exercise,
 * then reveals the word with a fade animation when exercise is over.
 *
 * Used in non-typing exercises (e.g., multiple choice) where the user
 * doesn't type the answer but the word is still hidden until reveal.
 */
export default function ClozeStaticReveal({ word, isExerciseOver }) {
  const fixedUnderlineLength = '4em';

  return (
    <span
      key={word.id}
      style={{
        position: 'relative',
        display: 'inline-block',
        minWidth: fixedUnderlineLength,
        textAlign: 'center',
        marginRight: '0.5em'
      }}
    >
      {/* Underline placeholder - visible during exercise */}
      <span
        style={{
          position: 'absolute',
          opacity: isExerciseOver ? 0 : 1,
          transition: 'opacity 0.6s ease-in-out',
          borderBottom: '2px dotted #333',
          width: fixedUnderlineLength,
          display: 'inline-block',
          height: '1.2em',
          left: '50%',
          transform: 'translateX(-50%)',
          top: 0
        }}
      />

      {/* Actual word - revealed when exercise is over */}
      <span
        style={{
          opacity: isExerciseOver ? 1 : 0,
          transition: 'opacity 0.6s ease-in-out',
          color: orange500,
          fontWeight: 'bold',
          display: 'inline-block'
        }}
      >
        {word.word}
      </span>
    </span>
  );
}
