import React, { useEffect, useState } from 'react';
import './UserList.css';
import { collection, getDocs } from "firebase/firestore";
import { db } from "../Firebase";

export default function UserList() {
  const [users, setUsers] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [taskCounts, setTaskCounts] = useState({});

  const fetchUsers = async () => {
    const querySnapshot = await getDocs(collection(db, "todolists"));
    const userData = querySnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
    setUsers(userData);
  };

  const fetchTasks = async () => {
    const querySnapshot = await getDocs(collection(db, "tasks"));
    const taskData = querySnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
    setTasks(taskData);
  };

  useEffect(() => {
    fetchUsers();
    fetchTasks();
  }, []);

  useEffect(() => {
    const counts = {};
    tasks.forEach((task) => {
      console.log(task,"yttttttttttttt")
      const todoListId = task.todoListId;
      console.log(todoListId,"eeeeeeeeee")
      if (counts[todoListId]) {
        
        counts[todoListId] += 1;
      } else {
        counts[todoListId] = 1;
      }
    });
    setTaskCounts(counts);
    console.log(taskCounts)
    console.log(users)
  }, [tasks]);

  return (
    <div className="table-container">
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>No. of Tasks</th>
            <th>Created At</th>
            <th>User Updated At</th>
          </tr> 
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.name}</td>
              <td>{user.userInfo}</td>
              <td>{taskCounts[user.id] || 0}</td>
              <td>{user.createdAt}</td>
              <td>{user.createdAt}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
