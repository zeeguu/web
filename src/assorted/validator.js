export default function validator(validatorRules, errorFunction) {
  for (let i = 0; i < validatorRules.length; i++) {
    let rule = validatorRules[i];

    if (rule[0]) {
      errorFunction(rule[1]);
      return false;
    }
  }

  return true;
}
