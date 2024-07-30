import React from 'react';
import { Link, useNavigate } from "react-router-dom";
import './Menu.css';

export default function Menu() {
  const navigate = useNavigate();

  const userHandle = () => {
    navigate('/userlist');
  };

  const taskListHandle = () => {
    navigate('/tasklist');
  };

  const userTaskHandle = () => {
    navigate('/usertask');
  };

  return (
    <div className='menuu'>
      <button className='btn' onClick={userHandle}>User List</button>
      <button className='btn' onClick={taskListHandle}>Task Lists</button>
      <button className='btn' onClick={userTaskHandle}>Task</button>
    </div>
  );
}
