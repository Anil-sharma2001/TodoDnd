import React, { useState, useEffect } from 'react';
import { getFirestore, collection, addDoc, query, where, getDocs } from 'firebase/firestore';
import { app } from "./Firebase";
import { Draggable, Droppable } from 'react-beautiful-dnd';
import "./Task.css";

const db = getFirestore(app);

function Task({ todoListId, initialTasks, addTask }) {
  const [taskTitle, setTaskTitle] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [taskDueDate, setTaskDueDate] = useState("");
  const [taskPriority, setTaskPriority] = useState("low");
//   const [tasks, setTasks] = useState(initialTasks || { low: [], medium: [], high: [] });
console.log('>>>>>',initialTasks);
//   const addTask = async () => {
//     try {
//       const docRef = await addDoc(collection(db, "tasks"), {
//         todoListId,
//         title: taskTitle,
//         description: taskDescription,
//         dueDate: taskDueDate,
//         priority: taskPriority,
//       });
//       alert("Task created with ID: " + docRef?.id);
//       setTaskTitle("");
//       setTaskDescription("");
//       setTaskDueDate("");
//       fetchTasks();
//     } catch (e) {
//       console.error("Error adding task: ", e);
//     }
//   };

  const fetchTasks = async () => {
    try {
      const q = query(collection(db, "tasks"), where("todoListId", "==", todoListId));
      const querySnapshot = await getDocs(q);
      const taskList = { low: [], medium: [], high: [] };
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        taskList[data.priority].push({ id: doc?.id, ...data });
      });
    //   console.log('--------',{taskList})
    //   setTasks(taskList);
    } catch (e) {
      console.error("Error fetching tasks: ", e);
    }
  };

//   useEffect(() => {
//     fetchTasks();
//   }, [todoListId]);

//   useEffect(() => {
//     setTasks(initialTasks || { low: [], medium: [], high: [] });
//   }, [initialTasks]);

  return (
    <div className='task'>
      <h3>Tasks</h3>
      <input
        type="text"
        placeholder="Task title"
        value={taskTitle}
        onChange={(e) => setTaskTitle(e.target.value)}
      />
      <input
        type="text"
        placeholder="Task description"
        value={taskDescription}
        onChange={(e) => setTaskDescription(e.target.value)}
      />
      <input
        type="date"
        value={taskDueDate}
        onChange={(e) => setTaskDueDate(e.target.value)}
      />
      <select
        value={taskPriority}
        onChange={(e) => setTaskPriority(e.target.value)}
      >
        <option value="low">Low</option>
        <option value="medium">Medium</option>
        <option value="high">High</option>
      </select>
    <button onClick={()=>{
        setTaskTitle("");
        setTaskDescription("");
        setTaskDueDate("");
        // fetchTasks();
        addTask({
    todoListId,
    title: taskTitle,
    description: taskDescription,
    dueDate: taskDueDate,
    priority: taskPriority,
    })}}>Add Task</button>
      <div className="priority-columns">
        {['low', 'medium', 'high'].map((priority) => (
          <Droppable droppableId={`${priority}-${todoListId}`} key={priority}>
            {(provided) => {
                console.log(priority,initialTasks[priority]);
                return(
              <div
                className={`task-container ${priority}`}
                ref={provided.innerRef}
                {...provided.droppableProps}
              >
                {initialTasks && initialTasks[priority] && initialTasks[priority].map((task, index) => {
                    console.log({initialTasks,task})
                return (
                  <Draggable draggableId={task?.id} index={index} key={task?.id}>
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className="task-item"
                      >
                        <h4>{task.title}</h4>
                        <p>{task.description}</p>
                        <p>Due: {task.dueDate}</p>
                      </div>
                    )}
                  </Draggable>
                )})}
                {provided.placeholder}
              </div>
            )}}
          </Droppable>
        ))}
      </div>
    </div>
  );
}

export default Task;
