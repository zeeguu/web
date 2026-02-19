/**
 * Insert a character at the current cursor position in an input field.
 * Falls back to appending if inputRef is not available.
 *
 * @param {Object} inputRef - React ref to the input element
 * @param {string} char - Character to insert (or 'BACKSPACE' to delete)
 * @param {string} currentValue - Current input value (used for fallback)
 * @param {function} callback - Called with the new value
 * @returns {boolean} - Whether the operation was performed (false if nothing to delete)
 */
export function insertAtCursor(inputRef, char, currentValue, callback) {
  if (inputRef?.current) {
    const input = inputRef.current;
    const start = input.selectionStart || 0;
    const end = input.selectionEnd || 0;
    const value = input.value;

    let newValue;
    let newCursorPos;

    if (char === 'BACKSPACE') {
      if (start === 0 && start === end) {
        return false; // Nothing to delete
      }
      if (start === end) {
        // No selection, delete char before cursor
        newValue = value.slice(0, start - 1) + value.slice(end);
        newCursorPos = start - 1;
      } else {
        // Selection exists, delete selection
        newValue = value.slice(0, start) + value.slice(end);
        newCursorPos = start;
      }
    } else {
      newValue = value.slice(0, start) + char + value.slice(end);
      newCursorPos = start + char.length;
    }

    input.value = newValue;
    input.setSelectionRange(newCursorPos, newCursorPos);
    input.focus();
    callback(newValue);
  } else {
    // Fallback: append/remove from end
    if (char === 'BACKSPACE') {
      if (currentValue.length === 0) {
        return false;
      }
      callback(currentValue.slice(0, -1));
    } else {
      callback(currentValue + char);
    }
  }
  return true;
}
