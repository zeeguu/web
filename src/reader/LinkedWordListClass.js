import { v4 as uuid } from 'uuid'
import LinkedList from 'linked-list'

export class Word extends LinkedList.Item {
  constructor (word) {
    super()
    this.id = uuid()
    this.word = word
    this.translation = null
  }
}

export default class LinkedWordList {
  constructor (text) {
    this.linkedWords = LinkedList.from(splitTextIntoWords(text))
  }

  getWords () {
    return this.linkedWords.toArray()
  }

  fuseWithPrevious (word) {
    word.word = word.prev.word + ' ' + word.word
    word.prev.detach()
    return word
  }

  fuseWithNext (word) {
    word.word = word.word + ' ' + word.next.word
    word.next.detach()
    return word
  }

  fuseWithNeighborsIfNeeded (word) {
    let newWord = word
    if (word.prev && word.prev.translation) {
      newWord = this.fuseWithPrevious(word)
    }

    if (word.next && word.next.translation) {
      newWord = this.fuseWithNext(word)
    }

    return newWord
  }
}

// Private functions
function splitTextIntoWords (text) {
  let splitWords = text
    .trim()
    .split(/[\s,]+/)
    .map(word => new Word(word))
  return splitWords
}
