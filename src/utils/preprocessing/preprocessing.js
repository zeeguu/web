function preprocessing(string) {
    let regex = /[¡!"”“„#$%&'(–)*+,…./—:;«<=>»¿?@[\]^_`{|}~]/g;
    return string.replace(regex, "");
}

function tokenize(sentence) {
    return sentence.split(" ")
}

export {tokenize, preprocessing}