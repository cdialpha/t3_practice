import React from 'react'
import { comments } from '../../../data/comments'
const CommentId = ({comment}) => {
  return (
    <div>
        <h1>{comment.id}</h1>
        <h1>{comment.text}</h1>
    </div>
  )
}

export async function getStaticPaths() {
return {
    paths: [
        {params: {commendId: '1'}},
        {params: {commendId: '2'}},
        {params: {commendId: '3'}},
    ], 
    fallback: false,
}
};

export async function getStaticProps(context) {
    const { params } = context; 
    const { commentId } = params;
    const comment = comments.find((comment) => comment.id === parseInt(commentId))
    console.log(comment)
}

export default CommentId