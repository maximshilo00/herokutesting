import React from 'react'
import { useState } from 'react'
import { useEffect } from 'react'

import Post from './Post'

import '../css/Wall.css'

const placeholders = [
    'Just ate brunch at the local café! YUMMY!',
    'Grabbing COFFEE on the go! Too much caffiene?',
    'YOGA IS GREAT',
    'This book is something else ...',
    'Missing my boo :(',
    'ECHO! is great!',
    'Is Mark on here?',
    'Gotta find the restroom in here ... FAST!'
]

export default function Wall (props) {
    const [newPostContent, setNewPostContent] = useState(null)
    const [newPostTitle, setNewPostTitle] = useState('null')
    
    const [postsToShow, setPostsToShow] = useState(null)

    useEffect(() => {
        const USEEFFECTshowPost = showPosts
        USEEFFECTshowPost()
    }, [])

    const createNewPost = async () => {
        let tempPost = {
            title : 'title',
            content : newPostContent,
            user : sessionStorage.getItem('user'),
            date : new Date(Date.now()).toUTCString()
        }

        let res = await fetch('/db/addNewPost', {
            method : 'POST',
            headers : {
                'Content-Type' : 'application/json'
            },
            body : JSON.stringify(tempPost)
        }).then(res => res.json())

        if (res.added) {
            alert(res.valid)
            showPosts()
        } else {
            alert('ERROR')
        }
    }

    const showPosts = async () => {
        let tempPosts = []

        let res = await fetch('/db/getPostsByUser', {
            method : 'POST',
            headers : {
                'Content-Type' : 'application/json'
            },
            body : JSON.stringify({
                user : sessionStorage.getItem('user')
            })
        }).then(res => res.json())

        if (res.found) {
            tempPosts = [...res.valid]
        } else {
            alert('error')
        }

        res = await fetch('/db/getPostsByFollowing', {
            method : 'POST', 
            headers : {
                'Content-Type' : 'application/json'
            },
            body : JSON.stringify({
                user : sessionStorage.getItem('user')
            })
        }).then(res => res.json())

        if (res.found) {
            res.valid.forEach(usersPosts => {
                tempPosts = [...tempPosts, ...usersPosts]
            })
        } else {
            alert('ERROR2')
        }

        tempPosts = sortPostsByDate(tempPosts)
        setPostsToShow([...tempPosts])
    }

    const sortPostsByDate = (posts) => {
        let tempPosts = posts.map(post => {
            let tempPost = post
            tempPost.numericDate = Date.parse(tempPost.date)

            return tempPost
        })

        tempPosts.sort((a, b) => b.numericDate - a.numericDate)
        return [...tempPosts]
    }

    return (
        <div onLoad={() => {}} className='Wall'>
            <div className='createPostDiv'>
                <h1 className='HomeH1' >SHARE A THOUGHT!</h1>
                {/* <input onChange={(e) => { setNewPostTitle(e.target.value) }} placeholder='post title'></input> */}
                <textarea maxLength={256} className='createPostTextArea' onChange={(e) => { setNewPostContent(e.target.value) }} placeholder={placeholders[Math.floor(Math.random() * placeholders.length)]}></textarea>
                <button className='homeButton' onClick={() => {createNewPost()}}>POST</button>
            </div>
            <div className='verticalLine'></div>
            <div className='wallPostsDiv'>
                {/* <button onClick={() => { showPosts() }}>SHOW POSTS</button> */}
                {
                    !postsToShow ? '' : postsToShow.map(post => <Post {...post} />)
                }
            </div>
        </div>
    )
}