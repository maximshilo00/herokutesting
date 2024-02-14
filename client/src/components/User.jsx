import React from 'react'
import { useEffect  } from 'react'
import { useState } from 'react'
import { useParams } from 'react-router-dom'

import Post from './Post'

import '../css/User.css'

export default function User (props) {
    const params = useParams()
    const [user, setUser] = useState(null)

    useEffect(() => {
        const getUserInfo = async () => {
            let res = null
    
            let tempUser = {
                id : params.id,
                fullName : '',
                following : []
            }
    
            res = await fetch('/db/getUserFullName', {
                method : 'POST',
                headers : {
                    'Content-Type' : 'application/json'
                },
                body : JSON.stringify({
                    id : tempUser.id
                })
            }).then(res => res.json())
            tempUser.fullName = res.valid
            console.log(tempUser)
    
            res = await fetch('/db/getUserFollowing', {
                method : 'POST',
                headers : {
                    'Content-Type' : 'application/json'
                },
                body : JSON.stringify({
                    id : tempUser.id
                })
            }).then(res => res.json())
    
            console.log(res.valid)
            tempUser.following = res.valid
            console.log(tempUser)
    
            setUser({...tempUser})
        }

        getUserInfo()
    }, [])

    const followUser = async () => {
        let res = await fetch('/db/followUser', {
            method : 'POST',
            headers : {
                'Content-Type' : 'application/json'
            },
            body : JSON.stringify({
                id : sessionStorage.getItem('user'),
                subject : user.id
            })
        }).then(res => res.json())

        if (res.found) {
            if (res.valid) {
                let tempUser = user
                tempUser.following = res.following
                console.log(tempUser)
                setUser({...tempUser})
            } else {
                alert('SUBJECT NOT FOUND')
            }
        } else {
            alert('USER NOT FOUND')
        }
    }

    const [postsToShow, setPostsToShow] = useState(null)

    useEffect(() => {
        const USEEFFECTshowPost = showPosts
        USEEFFECTshowPost()
    }, [])

    const showPosts = async () => {
        let tempPosts = []

        let res = await fetch('/db/getPostsByUser', {
            method : 'POST',
            headers : {
                'Content-Type' : 'application/json'
            },
            body : JSON.stringify({
                user : params.id
            })
        }).then(res => res.json())

        if (res.found) {
            tempPosts = [...res.valid]
        } else {
            alert('error')
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
        <div className='User'>
            {/* <button onClick={() => { getUserInfo() }}></button> */}
            {
                user ? <div className='userDiv'>
                    <div className='userInfoDiv'>
                        <span className='userFullNameSpan'>{user.fullName}</span>
                        <span className='userFollowingSpan'>this user is following:</span>
                        <div className='userFollowingSubjects'>
                            {
                                user.following.map(subject => <span className='useFollowSubjectSpan'>{subject.fullName}</span>)
                            }
                        </div>
                    </div>
                    <div className='followUserDiv'>
                        <button className='homeButton' onClick={() => { followUser() }}>FOLLOW USER</button>
                    </div>
                </div> : 'loading ...'
            }
            <div className='userPagePostsDiv'>
                {/* <button onClick={() => { showPosts() }}>SHOW POSTS</button> */}
                {
                    !postsToShow ? '' : postsToShow.map(post => <Post {...post} />)
                }
            </div>
        </div>
    )
}