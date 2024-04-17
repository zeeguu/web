// doesn't remove punctuation when it is part of a word, e.g. "l'Italie" or "it's"
function removePunctuation(string) {
    let regex = /(\s|^)[¡!"”“„#$%&'(–)*+,…./—:;«<=>»¿?@[\]^_`{|}~]+|[¡!"”“„#$%&'(–)*+,…./—:;«<=>»¿?@[\]^_`{|}~]+(\s|$)/g;
    return string.replace(regex, "");
}

function tokenize(sentence) {
    return sentence.split(" ")
}

export {tokenize, removePunctuation}