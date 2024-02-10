import React from 'react'
import logo from './logo.svg';
import './App.css';

import User from './components/User'

function App() {
  const [data, setData] = React.useState(null)
  const [user, setUser] = React.useState(null)
  const [users, setUsers] = React.useState(null)

  const [username, setUsername] = React.useState(null)
  const [password, setPassword] = React.useState(null)

  React.useEffect(() => {
    fetch('/api')
      .then((res) => res.json())
      .then((data) => setData(data.message))
  }, [])

  const getUser = async () => {
    await fetch('/dbgetUser')
      .then(res => res.json())
      .then(data => setUser(data))
  }

  const registerUser = async () => {
    let newUser = {
      username,
      password
    }

    await fetch('/registerUser', {
      method: 'POST',
      headers: {
        'Content-Type' : 'application/json'
      },
      body: JSON.stringify(newUser)
    })
      .then(res => res.json())
      .then(data => alert(data.added))
  }

  const showAllUsers = async () => {
    let tempUsers = []
    tempUsers = await fetch('/getAllUsers').then(res => res.json())
    setUsers([...tempUsers])
  }

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />

        {/* <p>{!data ? "Loading ..." : data}</p> */}
        {/* <p>{!user ? 'click button to show user' : user.username}</p> */}
        {/* <button onClick={() => getUser()}>CLICK ME</button> */}

        <div className='container'>
          <input onChange={(e) => { setUsername(e.target.value)}} type='text' placeholder='username'></input>
          <input onChange={(e) => { setPassword(e.target.value)}} type='password' placeholder='password'></input>
          <button onClick={() => registerUser()}>REGISTER</button>
        </div>

        <div className='container'>
          <button onClick={() => {showAllUsers()}}>SHOW USERS</button>
          {
            ! users ? 'no users to show ...' : users.map(user => <User {...user} />)
          }
        </div>
      </header>
    </div>
  );
}

export default App;
