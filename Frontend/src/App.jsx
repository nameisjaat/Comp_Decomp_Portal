import React from 'react'
import {Route,Routes} from 'react-router-dom'
import './App.css'
import Home from './pages/Home'
import Results from './pages/Results'

function App() {


  return (
    <>
    <div>
      <Routes>
        <Route path='/' element = {<Home/>}/>
        <Route path='/results' element={<Results/>}/>
      </Routes>
    </div>
    </>
  )
}

export default App
