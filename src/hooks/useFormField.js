import { useState } from "react";
import { validateMultipleRules } from "../utils/ValidatorRule/ValidatorRule";

/**
 * Hook to handle fields and validate them.
 *
 * @param {string} initialState - The intial value for the input field.
 * @param {InputValidator} validator - ValidatorRule that is used to validate the field.
 *
 */

export default function useFormField(initialState, validator) {
  const NO_INPUT_VALIDATION = "Input validation is undefinied.";

  const [currentState, setState] = useState(initialState);
  const [inputValidator, setInputValidator] = useState(validator);
  const [isInputValid, setIsInputValid] = useState(true);
  const [errorMessage, setErrorMessage] = useState(NO_INPUT_VALIDATION);

  function resetInputState() {
    setState("");
  }

  function validateInput() {
    if (inputValidator === undefined) {
      setIsInputValid(true);
      return true;
    }
    let _inputValidationArray = inputValidator;
    if (!Array.isArray(_inputValidationArray)) {
      _inputValidationArray = [inputValidator];
    }
    let _validationResult = validateMultipleRules(
      currentState,
      _inputValidationArray,
      setErrorMessage,
    );
    setIsInputValid(_validationResult);
    if (_validationResult) setErrorMessage("");
    return _validationResult;
  }

  return [
    currentState,
    setState,
    validateInput,
    isInputValid,
    errorMessage,
    resetInputState,
    setInputValidator,
  ];
}
