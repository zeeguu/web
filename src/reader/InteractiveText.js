import LinkedWordList from './LinkedWordListClass'
import _ from 'lodash'

export default class InteractiveText {
  constructor (content, articleInfo, zapi, voices, speak) {
    this.articleInfo = articleInfo
    this.zapi = zapi
    this.voices = voices
    this.speak = speak
    //
    this.paragraphs = content.split(/\n\n/)
    this.paragraphsAsLinkedWordLists = this.paragraphs.map(
      each => new LinkedWordList(each)
    )

    // history allows undo-ing the word translations
    this.history = []
  }

  getParagraphs () {
    return this.paragraphsAsLinkedWordLists
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

  selectAlternative (word, alternative, onSuccess) {
    this.zapi.contributeTranslation(
      this.articleInfo.language,
      localStorage.native_language,
      word.word,
      alternative,
      this.getContext(word),
      window.location,
      this.articleInfo.title
    )
    word.translation = alternative
    word.service_name = 'Own alternative selection'

    onSuccess()
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

  pronounce (word) {
    function randomElement (x) {
      return x[Math.floor(Math.random() * x.length)]
    }

    function getRandomVoice (voices, language) {
      let x = randomElement(voices.filter(v => v.lang.includes(language)))
      console.log(x)
      return x
    }
    let voice = getRandomVoice(this.voices, this.articleInfo.language)
    this.speak({ text: word.word, voice: voice })
  }

  getContext (word) {
    function endOfSentenceIn (word) {
      let text = word.word
      return text[text.length - 1] === '.'
    }
    function getLeftContext (word, count) {
      if (count === 0 || !word || endOfSentenceIn(word)) return ''
      return getLeftContext(word.prev, count - 1) + ' ' + word.word
    }

    function getRightContext (word, count) {
      if (count === 0 || !word || endOfSentenceIn(word)) return ''
      return word.word + ' ' + getRightContext(word.next, count - 1)
    }
    let context =
      getLeftContext(word.prev, 2) +
      ' ' +
      word.word +
      ' ' +
      getRightContext(word.next, 2)
    console.log(context)
    return context
  }
}
