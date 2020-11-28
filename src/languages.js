const languages_dict = {
  en: 'English',
  fr: 'French',
  de: 'German'
}

function languages () {
  return Object.values(languages_dict)
}

function language_id (language) {
  const newObj = {}
  Object.keys(languages_dict).forEach(x => {
    newObj[languages_dict[x]] = x
  })
  return newObj[language]
}
function language_from_id (id) {
  return languages_dict[id]
}

export { language_from_id, languages, languages_dict, language_id }
