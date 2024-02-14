import React from 'react'
import { useState } from 'react'

import '../css/Home.css'

export default function Home (props) {
    const [registrationUsername, setRegistrationUsername] = useState(null)
    const [registrationPassword, setRegistrationPasswrod] = useState(null)
    const [registrationFullName, setRegistrationFullName] = useState(null)

    const [logInUsername, setLogInUsername] = useState(null)
    const [logInPassword, setLogInPassword] = useState(null)

    const registerNewUser = async () => {
        let res = await fetch('/db/registerNewUser', {
            method : 'POST',
            headers : {
                'Content-Type' : 'application/json'
            },
            body : JSON.stringify({
                username : registrationUsername,
                password : registrationPassword,
                fullName : registrationFullName
            })
        }).then(res => res.json())

        if (!res.found && res.added) {
            sessionStorage.setItem('user', res.valid)
            sessionStorage.setItem('username', logInUsername)
            // props.setUser(res.valid)
            props.setUser({
                username : logInUsername,
                id : res.valid
            })
            alert(res.valid)
            window.location.href = '/wall/' + sessionStorage.getItem('user')
        } else {
            alert('ERROR')
        }
        return res
    }

    const logInUser = async () => {
        let res = await fetch('/db/logInUser', {
            method : 'POST',
            headers : {
                'Content-Type' : 'application/json'
            },
            body : JSON.stringify({
                username : logInUsername,
                password : logInPassword
            })
        }).then(res => res.json())

        if (res.found) {
            sessionStorage.setItem('user', res.valid)
            sessionStorage.setItem('username', logInUsername)
            // props.setUser(res.valid)
            props.setUser({
                username : logInUsername,
                id : res.valid
            })
            alert(res.valid)
            window.location.href = '/wall/' + sessionStorage.getItem('user')
        } else {
            alert('ERROR')
        }
        return res
    }

    return (
        <div className='Home'>
            <div className='homeDefaultFlexColumnContainer'>
                <h1 className='HomeH1'>ECHO!</h1>
                <p className='homeP'>Echo is a social media platform that lets you express yourself and share your thoughts with the whole wide world!</p>
            </div>
            <div className='homeDefaultFlexColumnContainer'>
                <h1 className='HomeH1'>JOIN THE FUN</h1>
                <div style={{
                    margin: '12px'
                }}>
                    <input className='homeInput' onChange={(e) => { setRegistrationUsername(e.target.value) }} type='text' placeholder='Username'></input>
                    <input className='homeInput' onChange={(e) => { setRegistrationPasswrod(e.target.value) }} type='password' placeholder='Password'></input>
                    <input className='homeInput' onChange={(e) => { setRegistrationFullName(e.target.value) }} type='text' placeholder='Full Name'></input>
                </div>
                <button className='homeButton' onClick={() => {registerNewUser()}}>SIGN UP</button>
            </div>
            <div className='homeDefaultFlexColumnContainer'>
                <h1 className='HomeH1'>JUMP IN</h1>
                <div style={{
                    margin: '12px'
                }}>
                    <input className='homeInput' onChange={(e) => { setLogInUsername(e.target.value) }} type='text' placeholder='Username'></input>
                    <input className='homeInput' onChange={(e) => { setLogInPassword(e.target.value) }} type='password' placeholder='Password'></input>
                </div>
                <button className='homeButton' onClick={() => {logInUser()}}>SIGN IN</button>
            </div>
        </div>
    )
}