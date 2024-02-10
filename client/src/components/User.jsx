import React from 'react'

import '../css/User.css'

export default function User (props) {
    return (
        <div className='User'>
            <span id='usernameSpan' className='userSpan'>
                {props.username}
            </span>
            <span id='passwordSpan' className='userSpan'>
                {props.password}
            </span>
        </div>
    )
}