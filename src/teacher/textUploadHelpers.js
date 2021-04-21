//TODO Should be deleted if not used...

export const articleContentReader = (article) => {
    const reader = new FileReader()
    return new Promise((resolve, reject) => {
      reader.onload = function (event) {
        const content = event.target.result
  
        resolve(content)
      }
      reader.onerror = function (e) {
        reject(e)
      }
      reader.readAsText(article)
    })
  }
  
  export const createArticleObject = (name, content, languageCode, user) => {
    const title = name.substr(0, name.lastIndexOf('.')) || name
  
    const words = content.split(/\s+/)
    const summary = words.slice(0, 30).join(' ')
    const authors = user.name
  
    const articleObject = {
      title,
      content,
      authors,
      summary,
      language_code: languageCode,
    }
  
    return articleObject
  }
  