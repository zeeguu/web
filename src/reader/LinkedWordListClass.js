import { v4 as uuid } from 'uuid'
import LinkedList from 'linked-list'

export class Word extends LinkedList.Item {
  constructor (word) {
    super()
    this.id = uuid()
    this.word = word
    this.translation = null
  }

  fuseWithPrevious () {
    this.word = this.prev.word + ' ' + this.word
    this.prev.detach()
    return this
  }

  fuseWithNext () {
    this.word = this.word + ' ' + this.next.word
    this.next.detach()
    return this
  }

  fuseWithNeighborsIfNeeded () {
    let newWord = this
    if (this.prev && this.prev.translation) {
      newWord = this.fuseWithPrevious()
    }

    if (this.next && this.next.translation) {
      newWord = this.fuseWithNext()
    }

    return newWord
  }
}

export default class LinkedWordList {
  constructor (text) {
    this.linkedWords = LinkedList.from(splitTextIntoWords(text))
  }

  getWords () {
    return this.linkedWords.toArray()
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
