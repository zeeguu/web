function removePunctuation(string) {
    let regex = /[¡!"”“„#$%&'(–)*+,…./—:;«<=>»¿?@[\]^_`{|}~]/g;
    return string.replace(regex, "");
}

// so punctation isn't removed when it is part of a word, e.g. "l'Italie" or "it's"
function removePunctuationFollowedBySpace(string) {
    let regex = /[¡!"”“„#$%&'(–)*+,…./—:;«<=>»¿?@[\]^_`{|}~](?=\s|$)/g;
    return string.replace(regex, "");
}

function tokenize(sentence) {
    return sentence.split(" ")
}

export {tokenize, removePunctuation, removePunctuationFollowedBySpace}