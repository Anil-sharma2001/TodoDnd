import React from 'react'
import Sign from './component/Sign'
import Login from './component/Login'
import Todo from './component/Todo'
import {BrowserRouter as Router,Route,Routes} from 'react-router-dom'


export default function App() {
  return (
    <div>
      <Router>
        <Routes>
          <Route path='/' element={<Sign/>}/>
          <Route path='/login' element={<Login/>}/>
          <Route path='/todo' element={<Todo/>}/>
        </Routes>
      </Router>
    </div>
  )
}
