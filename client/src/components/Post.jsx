import React from 'react'
import { useState } from 'react'

import '../css/Post.css'

export default function Post (props) {
    const [likes, setLikes] = useState(props.likes)
    const likePost = async () => {
        let res = await fetch('/db/addLikeToPostById', {
            method : 'POST',
            headers : {
                'Content-Type' : 'application/json'
            },
            body : JSON.stringify({
                id : props._id
            })
        }).then(res => res.json())

        if (res.found) {
            setLikes(res.liked)
        } else {
            alert('ERROR')
        }
    }

    return (
        <div className='Post'>
            {/* <h1>TITLE : {props.title}</h1> */}
            <div className='postLikesDiv'>
                <span className='likesSpan'>{likes}</span>
                <span className='likesWordSpan'>hearts</span>
                <button className='likeButton' onClick={() => {
                    likePost()
                }}>
                    {'<3'}
                </button>
            </div>
            <div className='postContentDiv'>
                <p className='postContentP'>{props.content}</p>
                <div>
                    <span className='postAuthorSpan'>{props.author}</span>
                    <span className='postDateSpan'>{new Date(Date.parse(props.date)).toUTCString()}</span>
                </div>
            </div>
        </div>
    )
}