import React, { useState, useEffect } from 'react';
import { getFirestore, collection, addDoc, query, where, getDocs, doc, updateDoc } from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { app } from './Firebase';
import Task from './Task';
import { DragDropContext } from 'react-beautiful-dnd';
import "./TodoList.css";
import Menu from "./Menu";

const db = getFirestore(app);
const auth = getAuth(app);

function TodoList() {
  const [todoName, setTodoName] = useState("");
  const [todoLists, setTodoLists] = useState([]);
  const [userId, setUserId] = useState(null);
  const [mail,setMail]=useState('')
  const [count,setCount]=useState(0)
   
  
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid);
        fetchTodoLists(user.uid);
        setMail(auth.currentUser.email)
      }
    });

    return () => unsubscribe();
    
  }, []);

  const addTodoList = async () => {
    if (!userId) {
      alert("User not authenticated");
      return;
    }

    if (todoName.trim() === "") {
      alert("Todo list name cannot be blank");
      return;
    }

    try {
      const docRef = await addDoc(collection(db, "todolists"), {
        name: todoName,
        userId: userId,
        userInfo:mail,
      });
      alert("Todo List created with ID: " + docRef.id);
      setTodoName("");
      fetchTodoLists(userId);
    } catch (e) {
      console.error("Error adding document: ", e);
      alert("Failed to create Todo List. Please check console for details.");
    }
  };

  const fetchTodoLists = async (uid) => {
    try {
      const q = query(collection(db, "todolists"), where("userId", "==", uid));
      console.log(q)
      const querySnapshot = await getDocs(q);
      const lists = [];
      querySnapshot.forEach((doc) => {
        lists.push({ id: doc.id, ...doc.data(), tasks: { low: [], medium: [], high: [] } });
      });

      // Fetch tasks for each todo list
      const listsWithTasks = await Promise.all(
        lists.map(async (list) => {
          const tasksQuery = query(collection(db, "tasks"), where("todoListId", "==", list.id));
        
          const tasksSnapshot = await getDocs(tasksQuery);
         
          const tasks = { low: [], medium: [], high: [] };
        
          tasksSnapshot.forEach((taskDoc) => {
            const taskData = taskDoc.data();
           
            tasks[taskData.priority].push({ id: taskDoc.id, ...taskData });
          });
          return { ...list, tasks };
        })
      );

     
      setTodoLists(listsWithTasks);
    } catch (e) {
      console.error("Error fetching todo lists: ", e);
    }
  };

  const onDragEnd = async (result) => {
    // return
    console.log(result)
    const { destination, source, draggableId } = result;

    if (!destination) {
      return;
    }

    const sourcePriority = source.droppableId.split('-')[0];
    const sourceId = source.droppableId.split('-')[1];
    const destinationPriority = destination.droppableId.split('-')[0];
    const destinationId = destination.droppableId.split('-')[1];
    const todoListId = source.droppableId.split('-')[1];

    if (source.droppableId === destination.droppableId && source.index === destination.index) {
      return;
    }

    try {
      // Update the task's priority in Firestore
      const taskDocRef = doc(db, "tasks", draggableId);
      await updateDoc(taskDocRef, { priority: destinationPriority });

     
      setTodoLists((prevTodoLists) =>{
        console.log('prevTodoLists',prevTodoLists)
        return  prevTodoLists.map((list) => {
            if(list.id === sourceId && list.id !== destinationId){
              let tasks = JSON.parse(JSON.stringify(list.tasks))
              tasks[sourcePriority] = tasks[sourcePriority].filter((item,i)=>{
                return i !== source.index})
               return {...list, tasks}

            }
            if (list.id === destinationId) {
                let tasks = JSON.parse(JSON.stringify(list.tasks))
               let movedTask = prevTodoLists.find(item=>item.id === sourceId)?.tasks[sourcePriority].find((item, i)=>{
                return i === source.index})
                console.log({movedTask});
               tasks[sourcePriority] = tasks[sourcePriority].filter((item,i)=>{
                return i !== source.index})
               tasks[destinationPriority] = [...tasks[destinationPriority], {...movedTask, priority: destinationPriority}]
               console.log({...list, tasks});
               return {...list, tasks}
            //   const newTasks = { ...list.tasks };
            //   const [movedTask] = newTasks[sourcePriority].splice(source.index, 1);
            //   newTasks[destinationPriority].splice(destination.index, 0, movedTask);
            //   return { ...list, tasks: newTasks };
            }
            return list;
          })
      }
      );
    } catch (error) {
      console.error("Error updating task priority: ", error);
    }
  };



  const addTask = async (obj) => {
     
    try {
      const docRef = await addDoc(collection(db, "tasks"), obj);
      console.log(obj,"fghjskefhjkshuh")
      alert("Task created with ID: " + docRef?.id);
      setTodoLists((prevTodoLists) =>{
        console.log('prevTodoLists',prevTodoLists)
        return  prevTodoLists.map((list) => {
            if (list.id === obj.todoListId) {
                let tasks = {...list.tasks}
                tasks[obj.priority].push({id:docRef.id, ...obj})
                setCount(count+1)
                console.log(count)
               return {...list, tasks}
               
            }
            
            return list;
          })
      }
      );
    // fetchTodoLists()
    } catch (e) {
      console.error("Error adding task: ", e);
    }
  };
  return (
    <div className='menu'>
      <Menu/>
  <DragDropContext onDragEnd={onDragEnd}>
  <div className='todoHandle'>
    <h1>Todo Lists</h1>
    <input
      type="text"
      placeholder="Enter todo list name"
      value={todoName}
      onChange={(e) => setTodoName(e.target.value)}
      required
    />
    <br/>
    <button onClick={addTodoList}>Create Todo List</button>
  </div>
  <div className='todo-list'>
    <div className='todo-list-container'>
      {todoLists.map((list) => (
        <div key={list.id} className="todo-list-item">
          <h2>{list.name}</h2>
          <Task todoListId={list.id} initialTasks={list.tasks} addTask={addTask} />
        </div>
      ))}
    </div>
  </div>
</DragDropContext>
</div>
  );
}

export default TodoList;
