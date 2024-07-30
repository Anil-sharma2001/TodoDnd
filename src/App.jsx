import React from 'react'
import Sign from './component/Sign'
import Login from './component/Login'
import TodoList from './component/TodoList'
import {BrowserRouter as Router,Route,Routes} from 'react-router-dom'
import './App.css'
import UserList from './component/itemList/UserList'
import UsersTask from './component/itemList/UsersTask'
import TaskList from './component/itemList/TaskList'


export default function App() {
  
  return (
    <div>
      <Router>
        <Routes>
          <Route path='/' element={<Sign/>}/>
          <Route path='/login' element={<Login/>}/>
          <Route path='/todo' element={<TodoList/>}/>
          <Route path='/userlist' element={<UserList/>}/>
          <Route path='/usertask' element={<UsersTask/>} />
          <Route path='/tasklist' element={<TaskList/>}/>
        </Routes>
      </Router>
    </div>
  )
}
