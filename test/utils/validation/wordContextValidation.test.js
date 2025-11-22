import { validateWordInContext } from '../../../src/utils/validation/wordContextValidation';

describe('validateWordInContext', () => {
  describe('Danish characters', () => {
    test('should find phrase with Danish å character', () => {
      const word = 'Det skorter ikke på';
      const context = 'Det skorter ikke på kaffe i dag - vi har lavet tre kander.';
      const result = validateWordInContext(word, context);

      expect(result.valid).toBe(true);
      expect(result.errorMessage).toBeNull();
    });

    test('should find single Danish word', () => {
      const word = 'på';
      const context = 'Det skorter ikke på kaffe i dag';
      const result = validateWordInContext(word, context);

      expect(result.valid).toBe(true);
      expect(result.errorMessage).toBeNull();
    });

    test('should find phrase with æ character', () => {
      const word = 'ægte mælk';
      const context = 'Vi bruger kun ægte mælk i vores kaffebar.';
      const result = validateWordInContext(word, context);

      expect(result.valid).toBe(true);
      expect(result.errorMessage).toBeNull();
    });

    test('should find phrase with ø character', () => {
      const word = 'grønne bønner';
      const context = 'Jeg elsker grønne bønner til aftensmad.';
      const result = validateWordInContext(word, context);

      expect(result.valid).toBe(true);
      expect(result.errorMessage).toBeNull();
    });
  });

  describe('case insensitivity', () => {
    test('should match regardless of case', () => {
      const word = 'Hello World';
      const context = 'hello world is a common phrase';
      const result = validateWordInContext(word, context);

      expect(result.valid).toBe(true);
      expect(result.errorMessage).toBeNull();
    });
  });

  describe('single word validation', () => {
    test('should find single word in context', () => {
      const word = 'cat';
      const context = 'The cat sat on the mat.';
      const result = validateWordInContext(word, context);

      expect(result.valid).toBe(true);
      expect(result.errorMessage).toBeNull();
    });

    test('should not match partial words', () => {
      const word = 'cat';
      const context = 'The concatenate function is useful.';
      const result = validateWordInContext(word, context);

      expect(result.valid).toBe(false);
      expect(result.errorMessage).toContain('does not appear');
    });
  });

  describe('multi-word phrases', () => {
    test('should find multi-word phrase exactly once', () => {
      const word = 'good morning';
      const context = 'She said good morning to everyone.';
      const result = validateWordInContext(word, context);

      expect(result.valid).toBe(true);
      expect(result.errorMessage).toBeNull();
    });

    test('should detect phrase appearing multiple times', () => {
      const word = 'good morning';
      const context = 'Good morning! I said good morning already.';
      const result = validateWordInContext(word, context);

      expect(result.valid).toBe(false);
      expect(result.errorMessage).toContain('appears 2 times');
    });
  });

  describe('edge cases', () => {
    test('should handle extra whitespace', () => {
      const word = '  hello  ';
      const context = '  Say hello to my friend.  ';
      const result = validateWordInContext(word, context);

      expect(result.valid).toBe(true);
      expect(result.errorMessage).toBeNull();
    });

    test('should handle phrase at start of context', () => {
      const word = 'Det skorter ikke på';
      const context = 'Det skorter ikke på kaffe.';
      const result = validateWordInContext(word, context);

      expect(result.valid).toBe(true);
      expect(result.errorMessage).toBeNull();
    });

    test('should handle phrase at end of context', () => {
      const word = 'ikke på';
      const context = 'Det skorter ikke på';
      const result = validateWordInContext(word, context);

      expect(result.valid).toBe(true);
      expect(result.errorMessage).toBeNull();
    });
  });

  describe('no matches', () => {
    test('should return error when word not found', () => {
      const word = 'elephant';
      const context = 'The cat sat on the mat.';
      const result = validateWordInContext(word, context);

      expect(result.valid).toBe(false);
      expect(result.errorMessage).toContain('does not appear');
    });
  });
});
