function innerTextExcludingTranslation (el) {
  let childrenButNotTranslation = Array.from(el.childNodes).filter(
    e => e.nodeName !== 'Z-TRAN'
  )

  if (childrenButNotTranslation.length !== el.childNodes.length) {
    return childrenButNotTranslation[0].childNodes[0].wholeText
  } else {
    return el.innerText
  }
}
function oneSidedContext (
  rootEl,
  numberOfWordsInContext,
  siblingGetter,
  reducerFunction
) {
  let context = ''

  let cur = siblingGetter(rootEl)

  let count = 0
  while (cur && count < numberOfWordsInContext * 2) {
    if ('innerText' in cur) {
      context = reducerFunction(innerTextExcludingTranslation(cur), context)
    }
    cur = siblingGetter(cur)
    count += 1
  }

  return context
}

function extractPreContext (rootEl) {
  return oneSidedContext(
    rootEl,
    3,
    x => x.previousSibling,
    (each, total) => each + total
  )
}

function extractPostContext (rootEl) {
  return oneSidedContext(
    rootEl,
    3,
    x => x.nextSibling,
    (each, total) => total + each
  )
}

export default function extractContext (rootEl) {
  return (
    extractPreContext(rootEl) +
    innerTextExcludingTranslation(rootEl) +
    extractPostContext(rootEl)
  )
}
