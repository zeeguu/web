export default function TranslatableWord ({ word }) {
  if (!word.translation) {
    return (
      <z-tag class='origtrans' onClick={e => clicked(word)}>
        {word.word}
      </z-tag>
    )
  }

  return (
    <>
      <z-tag class='origtrans' onClick={e => clicked(word)}>
        <tran
          chosen={word.translation}
          suggestion=''
          possibly_more_translations=''
          translation0={word.translation}
          servicenametranslation0='Google - without context'
          transcount='1'
        >
          <singlealternative></singlealternative>
        </tran>
        <orig>{word.word}</orig>
      </z-tag>
      <span> </span>
    </>
  )
}
