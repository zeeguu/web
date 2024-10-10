import * as EmailValidatorFn from "email-validator";
import strings from "../../i18n/definitions";

/*
  This class is used in combination to the useFormField hook.

  It allows to define a rule and the message that should be given based 
  on the rule. There is some examples provided in this file, e.g. EmailValidator,
  MinimumLengthValidator.
*/

const Validator = class {
  constructor(validationFunction, validationErrorMessage) {
    this.validationFunction = validationFunction;
    this.validationErrorMessage = validationErrorMessage;
  }
};

const EmailValidator = new Validator((email) => {
  return EmailValidatorFn.validate(email);
}, strings.plsProvideValidEmail);

function NonEmptyValidator(msg = "Field cannot be empty.") {
  return new Validator((value) => {
    return value !== "" && value !== null && value !== undefined;
  }, msg);
}

function MinimumLengthValidator(n_chars, msg) {
  return new Validator((value) => {
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
  Validator,
  EmailValidator,
  NonEmptyValidator,
  MinimumLengthValidator,
  validateMultipleRules,
};
