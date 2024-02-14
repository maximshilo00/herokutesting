import React from 'react'
import { useState, useEffect } from 'react'

import '../css/Header.css'

export default function Header (props) {
    const [username, setUsername] = useState(null)

    useEffect(() => {
        const getUsername = async () => {
            let res = await fetch('/db/getUsernameById', {
                method : 'POST',
                headers : {
                    'Content-Type' : 'application/json'
                },
                body : JSON.stringify({ id : sessionStorage.getItem('user') })
            }).then(res => res.json())

            if (res.found) {
                setUsername(res.valid)
            } else {

            }
        }

        getUsername()
    }, [])

    const logOut = () => {
        sessionStorage.removeItem('user')
        sessionStorage.removeItem('username')
        window.location.href = '/'
    }

    return (
        <div className='Header'>
            <div className='headerLeftSide'>
                <span className='headerDefaultSpan' id='headerTitleSpan'>
                    ECHO!
                </span>
            </div>

            <div className='headerRightSide'>
                <span className='headerDefaultSpan' id='headerUsernameSpan'>
                    Hello, 
                    {
                        username ? ` ${username}` : ' You'
                    }
                </span>
                {
                    username ? 
                        <>
                            <button className='headerDefaultButton' onClick={() => {
                                window.location.href = `/wall/${sessionStorage.getItem('user')}`
                             }}>WALL</button>
                            <button className='headerDefaultButton' onClick={() => {
                               window.location.href = `/user/${sessionStorage.getItem('user')}`
                            }}>USER</button>
                            <button className='headerDefaultButton' onClick={() => { logOut() }}>LOG OUT</button>
                        </>
                        : <></>
                }
            </div>
        </div>
    )
}