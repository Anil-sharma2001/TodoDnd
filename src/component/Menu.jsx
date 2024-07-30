import React from 'react'
import {Link,useNavigate} from "react-router-dom"

export default function Menu() {
   const nevigate= useNavigate()

    const userHandle =()=>{
      nevigate('/userlist')
        
      }
      const taskListHandle=()=>{
       nevigate('/tasklist')
      }
      const userTaskHandle=()=>{
        nevigate('/usertask')
      }
 
  return (
    <div  className='container'>
        <button className='btn' onClick={userHandle}>User List</button>
        <button className='btn' onClick={taskListHandle}>Task Lists</button>
        <button className='btn' onClick={userTaskHandle}>Task</button>
      </div>
  )
}
