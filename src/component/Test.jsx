import React, { useState, useEffect } from 'react';
import { auth } from './Firebase';
import { signOut } from 'firebase/auth';
import { getDatabase, ref, get, child, set } from 'firebase/database';
import { useNavigate } from 'react-router-dom';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import './Dnd.css'; // Import your CSS file
import { db } from './Firebase';



export default function Todo() {
    const [count, setCount] = useState([]);
    const navigate = useNavigate();
    const [data, setData] = useState({
        title: '',
        description: '',
        date: '',
        priority: 'low',
    });

     let value = data.title
    const columnsFromBackend ={
        title:value,
        todo:{
            name:"TO Do",
            item:[]
        }, 
        inProgress: {
                    name: "In Progress",
                    items: []
                },
         done: {
                    name: "Done",
                    items: []
                }
    }
    const [columns, setColumns] = useState(columnsFromBackend);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setData((prev) => ({ ...prev, [name]: value }));
    };

    const handleData = async (e) => {
        const { title, description, date, priority } = data;
        if (!title || !description || !date) {
            alert('Please fill in all the required fields.');
            return;
        }
        e.preventDefault();
         set(ref(db,'myData/'+ value),columnsFromBackend).then(()=>{

             alert('Data is stored');
             setData({
                 title: '',
                 description: '',
                 date: '',
                 priority: 'low',
             });
             
         }).catch(err=>{
            console.log(err)
         })
        
    };

    const handleClick = async () => {
        try {
            await signOut(auth);
            navigate('/login');
        } catch (err) {
            console.log(err);
        }
    };

    const fetchData = async () => {
        const dbRef = ref(getDatabase());
        try {
            const snapshot = await get(child(dbRef, 'myData'));
            if (snapshot.exists()) {
                const data = snapshot.val();
                const tasksArray = Object.keys(data).map(key =>  ({
                    id: key,
                    ...data[key]
                }));

                const updatedColumns = {
                    todo: {
                        name: "To Do",
                        items: tasksArray.filter(task => task.priority === 'low')
                    },
                    inProgress: {
                        name: "In Progress",
                        items: tasksArray.filter(task => task.priority === 'medium')
                    },
                    done: {
                        name: "Done",
                        items: tasksArray.filter(task => task.priority === 'high')
                    }
                };

                setColumns(updatedColumns);
            } else {
                console.log("No data available");
            }
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const onDragEnd = (result) => {
        if (!result.destination) return;
        const { source, destination } = result;

        if (source.droppableId !== destination.droppableId) {
            const sourceColumn = columns[source.droppableId];
            const destColumn = columns[destination.droppableId];
            const sourceItems = [...sourceColumn.items];
            const destItems = [...destColumn.items];
            const [removed] = sourceItems.splice(source.index, 1);
            destItems.splice(destination.index, 0, removed);
            setColumns({
                ...columns,
                [source.droppableId]: {
                    ...sourceColumn,
                    items: sourceItems
                },
                [destination.droppableId]: {
                    ...destColumn,
                    items: destItems
                }
            });
        } else {
            const column = columns[source.droppableId];
            const copiedItems = [...column.items];
            const [removed] = copiedItems.splice(source.index, 1);
            copiedItems.splice(destination.index, 0, removed);
            setColumns({
                ...columns,
                [source.droppableId]: {
                    ...column,
                    items: copiedItems
                }
            });
        }
    };

    const handleName =(e)=>{
        e.preventDefault();
        const value = data.title;
        setCount([...count, value]);

        
    };

    return (
        <div>
            <button onClick={handleClick} className="sign-out-btn">Sign Out</button>
            <div className='contain'>
              <div className='title'>
                <label>
                    Task title:
                    <input type='text' name='title' value={data.title} onChange={handleChange} required/>
                    <button onClick={handleName} className="add-more-btn">Add More</button>
                </label>
                </div>
                <div className='tasks-container'>
                    {count.map((e) => (
                        <form key={e} className="task-form" onSubmit={handleData}>
                            <div style={{display:'flex', justifyContent:"center"}}>
                               <h3>{e}</h3>
                            </div>
                            <label>
                                Task Description:
                                <input type='text' name='description' value={data.description} onChange={handleChange} required />
                            </label>
                            <label>
                                Task due date:
                                <input type='date' name='date' value={data.date} onChange={handleChange} required/>
                            </label>
                            <label>
                                Task priority:
                                <select name='priority' value={data.priority} onChange={handleChange}>
                                    <option value='low'>Low</option>
                                    <option value='medium'>Medium</option>
                                    <option value='high'>High</option>
                                </select>
                            </label>
                            <button type="submit" className="submit-btn">Add</button>
                <div className='drag-drop-container'>
                    <DragDropContext onDragEnd={onDragEnd}>
                        {Object.entries(columns).map(([columnId, column], index) => (
                            
                            <div key={columnId} className="column">
                               
                                <p>{column.name}</p>
                                <Droppable droppableId={columnId} key={columnId}>
                                    {(provided, snapshot) => (
                                        <div
                                            {...provided.droppableProps}
                                            ref={provided.innerRef}
                                            className={`droppable-col ${snapshot.isDraggingOver ? 'dragging-over' : ''}`}
                                        >
                                            {column.items.map((item, index) => (
                                                <Draggable key={item.id} draggableId={item.id} index={index}>
                                                    {(provided, snapshot) => (
                                                        <div
                                                            ref={provided.innerRef}
                                                            {...provided.draggableProps}
                                                            {...provided.dragHandleProps}
                                                            className={`draggable-item ${snapshot.isDragging ? 'dragging' : ''}`}
                                                        >
                                                            <span>{item.title}</span>
                                                            <br></br>
                                                            <span>{item.description}</span>
                                                            <br></br>
                                                            <span>{item.date}</span>
                                                        </div>
                                                    )}
                                                </Draggable>
                                            ))}
                                            {provided.placeholder}
                                        </div>
                                    )}
                                </Droppable>
                            </div>
                        ))}
                    </DragDropContext>
                </div>
                        </form>
                    ))}
                </div>
            </div>
        </div>
    );
}
