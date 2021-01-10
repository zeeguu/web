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

  translate (word, onSucess) {
    this.history.push(_.cloneDeep(this.paragraphsAsLinkedWordLists))
    let context = word.word

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

  undo () {
    this.paragraphsAsLinkedWordLists = this.history.pop()
  }
}
