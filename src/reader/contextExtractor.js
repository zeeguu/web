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
      context = reducerFunction(cur.innerText, context)
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
    extractPreContext(rootEl) + rootEl.innerText + extractPostContext(rootEl)
  )
}
