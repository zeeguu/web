import { useParams, Link } from 'react-router-dom'
import Exercises from './Exercises'

export default function ExercisesForArticle ({ zapi }) {
  let { articleID } = useParams()

  return (
    <>
      {/* <h1>{articleID}</h1> */}
      <Exercises api={zapi} articleID={articleID} />
    </>
  )
}
