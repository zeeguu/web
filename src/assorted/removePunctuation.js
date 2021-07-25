export default function removePunctuation(string) {
  let regex = /[¡!"”“„#$%&'(–)*+,…./—:;«<=>»¿?@[\]^_`{|}~]/g;
  return string.replace(regex, "");
}
