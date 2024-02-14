import React from 'react'
import { useState } from 'react'
import { BrowserRouter as Router, Link, Route, Routes } from 'react-router-dom';
import './App.css';

import Home from './components/Home'
import Wall from './components/Wall'
import User from './components/User'
import Search from './components/Search'
import Header from './components/Header'

function App() {
  const [user, setUser] = useState(null)

  return (
    <div className="App">
      <Header />
      <Search />
      <Router>
        {/* <nav>
          <ul>
            <li><Link to="/">HOME</Link></li>
            <li><Link to={`/wall/${sessionStorage.getItem('user')}`}>WALL</Link></li>
            <li><Link to={`/user/${sessionStorage.getItem('user')}`}>USER</Link></li>
          </ul>
        </nav> */}
        <Routes>
          <Route path="/" element={<Home setUser={setUser} />} />
          <Route path="/wall/:id" element={<Wall />} />
          <Route path="/user/:id" element={<User />} />
        </Routes>
      </Router>

    </div>
  );
}

export default App;
