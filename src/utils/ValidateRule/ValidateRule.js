import * as EmailValidator from "email-validator";
import strings from "../../i18n/definitions";

/*
  This class is used in combination to the useFormField hook.

  It allows to define a rule and the message that should be given based 
  on the rule.There is some examples provided in this file, e.g. EmailValidation,
  LongerThanNValidation.
*/

const ValidateRule = class {
  constructor(validationFunction, validationErrorMessage) {
    this.validationFunction = validationFunction;
    this.validationErrorMessage = validationErrorMessage;
  }
};

const EmailValidation = new ValidateRule((email) => {
  return EmailValidator.validate(email);
}, strings.plsProvideValidEmail);

function NotEmptyValidationWithMsg(msg) {
  return new ValidateRule((value) => {
    return value !== "" && value !== null && value !== undefined;
  }, msg);
}

const NotEmptyValidation = NotEmptyValidationWithMsg(
  "This field cannot be empty.",
);

function LongerThanNValidation(n_chars, msg) {
  return new ValidateRule((value) => {
    return value.length > n_chars;
  }, msg);
}

function validateMultipleRules(value, validateRuleList, setErrorMsg) {
  let isValid = true;
  for (let i = 0; i < validateRuleList.length; i++) {
    let currentRule = validateRuleList[i];
    isValid = isValid && currentRule.validationFunction(value);

    if (!isValid) {
      if (setErrorMsg) setErrorMsg(currentRule.validationErrorMessage);
      break;
    }
  }
  return isValid;
}
export {
  ValidateRule,
  EmailValidation,
  NotEmptyValidation,
  NotEmptyValidationWithMsg,
  validateMultipleRules,
  LongerThanNValidation,
};
