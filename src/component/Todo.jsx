import React, { useState, useEffect } from 'react';
import { auth } from './Firebase';
import { signOut } from 'firebase/auth';
import { getDatabase, ref, get, child } from 'firebase/database';
import { useNavigate } from 'react-router-dom';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import './Dnd.css'

export default function Todo() {
    const navigate = useNavigate();
    const [data, setData] = useState({
        title: '',
        description: '',
        date: '',
        priority: 'low',
    });

    const columnsFromBackend = {
        todo: {
            name: "To Do",
            items: []
        },
        inProgress: {
            name: "In Progress",
            items: []
        },
        done: {
            name: "Done",
            items: []
        }
    };

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
        const res = await fetch('https://authentication-3cf16-default-rtdb.firebaseio.com/myData.json', {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                title, description, date, priority
            })
        });
        if (res) {
            alert('Data is stored');
            setData({
                title: '',
                description: '',
                date: '',
                priority: 'low',
            });
            fetchData();
        } else {
            alert('Something went wrong');
        }
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
                const tasksArray = Object.keys(data).map(key => ({
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

    return (
        <div>
            <button onClick={handleClick}>Sign Out</button>
            <div className='container'>
                <form method='POST'>
                    <label>
                        Task title:
                        <input type='text' name='title' value={data.title} onChange={handleChange} required/>
                    </label>
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
                  
                    <button onClick={handleData}>Submit</button>
                </form>
                <div style={{ display: 'flex', justifyContent: 'center', height: '100%' }}>
                    <DragDropContext onDragEnd={onDragEnd}>
                        {Object.entries(columns).map(([columnId, column], index) => (
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }} key={columnId}>
                                <h2>{column.name}</h2>
                                <div style={{ margin: 8 }}>
                                    <Droppable droppableId={columnId} key={columnId}>
                                        {(provided, snapshot) => (
                                            <div
                                                {...provided.droppableProps}
                                                ref={provided.innerRef}
                                                style={{
                                                    background: snapshot.isDraggingOver ? 'lightblue' : 'lightgrey',
                                                    padding: 4,
                                                    width: 250,
                                                    minHeight: 500
                                                }}
                                            >
                                                {column.items.map((item, index) => (
                                                    <Draggable key={item.id} draggableId={item.id} index={index}>
                                                        {(provided, snapshot) => (
                                                            <div
                                                                ref={provided.innerRef}
                                                                {...provided.draggableProps}
                                                                {...provided.dragHandleProps}
                                                                style={{
                                                                    userSelect: 'none',
                                                                    padding: 16,
                                                                    margin: '0 0 8px 0',
                                                                    minHeight: '50px',
                                                                    backgroundColor: snapshot.isDragging ? '#263B4A' : '#456C86',
                                                                    color: 'white',
                                                                    ...provided.draggableProps.style
                                                                }}
                                                            >
                                                                {item.title}<br/> {item.description} <br/> {item.date} 
                                                            </div>
                                                        )}
                                                    </Draggable>
                                                ))}
                                                {provided.placeholder}
                                            </div>
                                        )}
                                    </Droppable>
                                </div>
                            </div>
                        ))}
                    </DragDropContext>
                </div>
            </div>
        </div>
    );
}
