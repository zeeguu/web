import * as EmailValidatorFn from "email-validator";
import strings from "../../i18n/definitions";

/*
  This class is used in combination to the useFormField hook.

  It allows to define a rule and the message that should be given based 
  on the rule.There is some examples provided in this file, e.g. EmailValidator,
  MinimumLengthValidator.
*/

const ValidatorRule = class {
  constructor(validationFunction, validationErrorMessage) {
    this.validationFunction = validationFunction;
    this.validationErrorMessage = validationErrorMessage;
  }
};

const EmailValidator = new ValidatorRule((email) => {
  return EmailValidatorFn.validate(email);
}, strings.plsProvideValidEmail);

function NonEmptyValidation(msg = "Field cannot be empty.") {
  return new ValidatorRule((value) => {
    return value !== "" && value !== null && value !== undefined;
  }, msg);
}

function MinimumLengthValidator(n_chars, msg) {
  return new ValidatorRule((value) => {
    return value.length > n_chars;
  }, msg);
}

function validateMultipleRules(value, ValidatorRuleList, setErrorMsg) {
  let isValid = true;
  for (let i = 0; i < ValidatorRuleList.length; i++) {
    let currentRule = ValidatorRuleList[i];
    isValid = isValid && currentRule.validationFunction(value);

    if (!isValid) {
      if (setErrorMsg) setErrorMsg(currentRule.validationErrorMessage);
      break;
    }
  }
  return isValid;
}
export {
  ValidatorRule,
  EmailValidator,
  NonEmptyValidation,
  validateMultipleRules,
  MinimumLengthValidator,
};
