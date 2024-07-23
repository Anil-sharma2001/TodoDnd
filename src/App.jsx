import React from 'react'
import Sign from './component/Sign'
import Login from './component/Login'
import TodoList from './component/TodoList'
import {BrowserRouter as Router,Route,Routes} from 'react-router-dom'
import Todo from './component/Todo'


export default function App() {
  return (
    <div>
      <Router>
        <Routes>
          <Route path='/' element={<Sign/>}/>
          <Route path='/login' element={<Login/>}/>
          <Route path='/todo' element={<TodoList/>}/>
        </Routes>
      </Router>
    </div>
  )
}
