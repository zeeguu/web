import { useState } from "react";
import { validateMultipleRules } from "../utils/ValidateRule/ValidateRule";

/**
 * Hook to handle fields and validate them.
 *
 * @param {string} initialState - The intial value for the input field.
 * @param {InputValidator} InputValidator - ValidatorRule that is used to validate the field.
 *
 */

export default function useFormField(initialState, InputValidator) {
  const NO_INPUT_VALIDATION = "Input validation is undefinied.";

  const [currentState, setState] = useState(initialState);
  const [inputValidation, setInputValidation] = useState(InputValidator);
  const [isInputValid, setIsInputValid] = useState(true);
  const [errorMessage, setErrorMessage] = useState(NO_INPUT_VALIDATION);

  function resetInputState() {
    setState("");
  }

  function validateInput() {
    if (inputValidation === undefined) {
      setIsInputValid(false);
      return false;
    }
    let _inputValidationArray = inputValidation;
    if (!Array.isArray(_inputValidationArray)) {
      _inputValidationArray = [inputValidation];
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
    setInputValidation,
  ];
}
