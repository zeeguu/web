import React, { useState } from 'react'
import { languageMap } from '../helpers/sharedHelperMaps'
import { Button, TextField } from '@material-ui/core'
import { uploadArticles } from '../api/apiArticles'
import { createArticleObject }  from '../helpers/articleUploadHelpers'

export const UserInputArticleUpload = ({ user, setForceRerender, cohortData }) => {
  const languageCode = languageMap[cohortData.language_name]

  const [state, setState] = useState({
    article_title: '',
    article_content: '',
  })

  const handleChange = (event) => {
    setState({
      ...state, //for all element in state do ...
      [event.target.name]: event.target.value, //ie: article_title : "Harry Potter tickets sold out", article_content : "bla bla bla"
    })
  }

  const submitArticle = (e) => {
    e.preventDefault()
    let articleObj = createArticleObject(
      state.article_title,
      state.article_content,
      languageCode,
      user
    )
    uploadArticles(cohortData.id, [articleObj]).then((result) => {
      setForceRerender(prev => prev + 1)
    })
    setState({
      article_title: '',
      article_content: '',
    })
  }

  return (
    <form onSubmit={submitArticle}>
      <TextField
        type="text"
        placeholder="This will be the title of the article"
        value={state.article_title}
        onChange={handleChange}
        name="article_title"
        id="article_title"
        label="Article title"
        fullWidth
      />
      <TextField
        type="text"
        placeholder="Type any text here to create an article"
        multiline={true}
        value={state.article_content}
        onChange={handleChange}
        name="article_content"
        id="article_content"
        label="Article content"
        rows={6}
        fullWidth
      />
      <div>
        <Button
          style={{ marginTop: 10 }}
          type="submit"
          variant="contained"
          color="primary"
          disabled={!(state.article_title && state.article_content)}
        >
          Submit Article{' '}
        </Button>
      </div>
    </form>
  )
}
