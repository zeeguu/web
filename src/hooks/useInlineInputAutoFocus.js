import { useEffect } from 'react';

/**
 * Custom hook to provide auto-focus functionality for inline inputs in exercises
 * 
 * @param {Object} options - Configuration options
 * @param {boolean} options.enabled - Whether auto-focus is enabled
 * @param {boolean} options.isExerciseOver - Whether the exercise is completed
 * @param {boolean} options.hasInteractiveText - Whether interactive text is loaded
 * @param {string} options.exerciseClassName - CSS class name of the exercise component
 * @param {number} options.focusDelay - Delay in ms before auto-focusing (default: 300)
 */
export default function useInlineInputAutoFocus({
  enabled = true,
  isExerciseOver = false,
  hasInteractiveText = false,
  exerciseClassName,
  focusDelay = 300
}) {
  // Auto-focus input when user starts typing
  useEffect(() => {
    if (!enabled || isExerciseOver) return;

    const handleKeyDown = (e) => {
      const isTypingKey = (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) || 
                          e.key === 'Backspace';
      
      if (isTypingKey) {
        // Try multiple selectors to find the input
        let inputElement = document.querySelector(`.${exerciseClassName} input[type="text"]`);
        if (!inputElement) {
          inputElement = document.querySelector(`.${exerciseClassName} input`);
        }
        if (!inputElement) {
          // Fallback: find any input in the context area
          inputElement = document.querySelector('.contextExample input[type="text"]');
        }
        
        if (inputElement && document.activeElement !== inputElement) {
          inputElement.focus();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [enabled, isExerciseOver, exerciseClassName]);

  // Auto-focus input on desktop after component loads
  useEffect(() => {
    if (!enabled || !hasInteractiveText || isExerciseOver) return;

    const timer = setTimeout(() => {
      const inputElement = document.querySelector(`.${exerciseClassName} input[type="text"]`) ||
                           document.querySelector('.contextExample input[type="text"]');
      if (inputElement) {
        inputElement.focus();
      }
    }, focusDelay);

    return () => clearTimeout(timer);
  }, [enabled, hasInteractiveText, isExerciseOver, exerciseClassName, focusDelay]);
}