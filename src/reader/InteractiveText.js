import LinkedWordList from './LinkedWordListClass'
import _ from 'lodash'

export default class InteractiveText {
  constructor (articleInfo, zapi) {
    this.articleInfo = articleInfo
    this.zapi = zapi
    //
    this.paragraphs = articleInfo.content.split(/\n\n/)
    console.log(this.paragraphs)
    this.paragraphsAsLinkedWordLists = this.paragraphs.map(
      each => new LinkedWordList(each)
    )

    this.history = []
  }

  getParagraphs () {
    return this.paragraphsAsLinkedWordLists
  }

  getContext (word) {
    //   TODO: to implement
    return word.word
  }

  translate (word, onSucess) {
    this.history.push(_.cloneDeep(this.paragraphsAsLinkedWordLists))
    let context = this.getContext(word)

    word = word.fuseWithNeighborsIfNeeded()

    this.zapi
      .getOneTranslation(
        this.articleInfo.language,
        localStorage.native_language,
        word.word,
        context,
        window.location,
        this.articleInfo.title
      )
      .then(response => response.json())
      .then(data => {
        word.translation = data['translations'][0].translation
        onSucess()
      })
  }

  alternativeTranslations (word, onSuccess) {
    let context = this.getContext(word)
    this.zapi
      .getNextTranslations(
        this.articleInfo.language,
        localStorage.native_language,
        word.word,
        context,
        this.articleInfo.url,
        -1,
        word.service_name,
        word.translation
      )
      .then(response => response.json())
      .then(data => {
        word.alternatives = data.translations.map(each => each.translation)
        onSuccess()
      })
  }

  undo () {
    if (this.history.length !== 0) {
      this.paragraphsAsLinkedWordLists = this.history.pop()
    }
  }
}
