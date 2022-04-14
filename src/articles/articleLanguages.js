const languagesWithoutArticles = ["ja", "cmn", "pl"]

export function articlesInLanguage(learnedLanguage){
    return (languagesWithoutArticles.indexOf(learnedLanguage) > -1);
  }