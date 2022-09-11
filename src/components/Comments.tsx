import React, { useState } from 'react'
import tw from "tailwind-styled-components" 


type AddComment = string;

type Comment = {
    id: number,
    text: AddComment, 
}

// type InputProps = {
//   type: "text"
//   value: string, 
//   onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
// }
 

const Container = tw.div`
flex 
flex-col
`

const Header = tw.h1`text-3xl font-extrabold`
const Button = tw.button`border-2 mt-2 pl-2 pr-2 pt-2 pb-2 hover:bg-gray-100`
const Row = tw.div`flex`

const CommentsPage = () => {
 const [comments, setComments ] = useState<Comment[]>([])
 const [comment, setComment ] = useState< AddComment | "">('')

 const fetchComments = async() => {
    const res = await fetch('/api/comments')
    const data = await res.json()
    setComments(data)
 }

 const addComment = async() => {
  const res = await fetch('/api/comments', {
    method: 'POST',
    body: JSON.stringify({comment}), 
    headers: { 'Content-Type': 'application/json' },
  })
  const data = await res.json()
  console.log( data )
}
    return (
    <Container>
    <Header>
        Comments Page
    </Header>
    <label> Add a comment </label> 
    <input type='text' value={comment} onChange={(event) => setComment(event.target.value)}/>  
    <Button onClick={addComment}> Add </Button> 
    <Button onClick={fetchComments}> Load Comments </Button>
    { comments ? comments.map(x => <Row key={x.id}> <h1 className='pr-2'> {x.id}</h1><h1> {x.text}</h1> </Row> ) : <h1> No Comments to display </h1>} 
    </Container>
  )
}

export default CommentsPage

