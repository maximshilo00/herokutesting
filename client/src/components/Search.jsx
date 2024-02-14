import React from 'react'
import { useState } from 'react'

import '../css/Search.css'

export default function Search (props) {
    const [searchString, setSearchString] = useState('')
    const [searchResults, setSearchResults] = useState([])

    const find = async () => {
        let tempString = searchString
        let res = await fetch('/db/searchItems', {
            method : 'POST',
            headers : {
                'Content-Type' : 'application/json'
            },
            body : JSON.stringify({
                search : tempString
            })
        }).then(res => res.json())

        console.log(res)
        
        if (searchString == '') {
            setSearchResults([])
            setSearchString('...')
        } else if (res.found) {
            setSearchResults([...res.results])
        }
    }

    if (searchString == '') {
        find()
    }


    return (
        <div className='Search'>
            <div className='searchBarInput'>
                <input onChange={(e) => { setSearchString(e.target.value) }} type='text' className='searchInput' placeholder='search (posts, users)'></input>
                <button className='searchButton' onClick={() => { find() }}>SEARCH</button>
            </div>

            <div className='searchBarResults'>
                {
                    searchResults.map((result, id) => { return <SearchResult pos={id} {...result}> </SearchResult> })
                }
            </div>
        </div>
    )
}

function SearchResult (props) {
    var position = {
        top : 1,
        right : 1,
        left : 1,
        bottom : 1
    }

    const determineHref = () => {
        let href = '/'

        if (props.type == 'user') {
            href += `${props.type}/${props.id}`
        } else {
            href += 'wall'
        }
        console.log(href)
        return href
    }

    const determinePosition = () => {
        position.top = (props.pos) * 35 + 104
    }

    determinePosition()
    console.log(position)

    return (
        <div style={{
            position : 'absolute',
            top : `${position.top}px`
        }} className='SearchResult'>
            <span><a href={determineHref()}>{props.info}</a></span>
            {/* <span>{props.type}</span> */}
        </div>
    )
}