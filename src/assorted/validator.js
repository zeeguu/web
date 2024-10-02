/**
 * Tests a sequence of validation rules, by calling each rule
 * returning true, if all validations pass.
 *
 * @param {Array[function]} validatorRules - List with functions that return a boolean.
 *                                           They could be for example a ValidateRule.validateFuntion
 *
 * @returns {boolean}
 *
 */

export default function validator(validatorRules) {
  let result = true;
  for (let i = 0; i < validatorRules.length; i++) {
    let test = validatorRules[i]();
    result = result && test;
  }
  return result;
}
