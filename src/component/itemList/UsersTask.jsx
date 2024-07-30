import React, { useState, useEffect } from 'react';
import './UserList.css';
import { collection, getDocs } from "firebase/firestore";
import { db } from "../Firebase";

export default function UsersTask() {
  const [users, setUsers] = useState([]);
  const [tasks, setTasks] = useState([]);

  const fetchUsers = async () => {
    const querySnapshot = await getDocs(collection(db, "todolists"));
    const userData = querySnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
    setUsers(userData);
    console.log(users, "userrrrrrrrr");
  };

  const fetchTasks = async () => {
    const querySnapshot = await getDocs(collection(db, "tasks"));
    const taskData = querySnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
    setTasks(taskData);
    console.log(tasks, "taslllll");
  };

  useEffect(() => {
    fetchUsers();
    fetchTasks();
  }, []);

  // Create a map of todoListId to name
  const userMap = users.reduce((acc, user) => {
    acc[user.id] = user.name;
    return acc;
  }, {});

  // Add name to each task based on todoListId
  const tasksWithNames = tasks.map(task => ({
    ...task,
    listTitle: userMap[task.todoListId] || 'Unknown'
  }));

  return (
    <div className="table-container">
      <table>
        <thead>
          <tr>
            <th>Task Title</th>
            <th>Task Description</th>
            <th>Task List Title</th>
            <th>Created By</th>
            <th>Created Time</th>
          </tr>
        </thead>
        <tbody>
          {
            tasksWithNames.map((task) => (
              <tr key={task.id}>
                <th>{task.title}</th>
                <th>{task.description}</th>
                <th>{task.listTitle}</th>
                <th>{task.mail}</th>
                <th>{task.created}</th>
              </tr>
            ))
          }
        </tbody>
      </table>
    </div>
  );
}
