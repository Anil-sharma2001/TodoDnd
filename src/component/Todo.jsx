import React, { useState, useEffect } from 'react';
import { auth } from './Firebase';
import { signOut } from 'firebase/auth';
import { getDatabase, ref, get, child, set } from 'firebase/database';
import { useNavigate } from 'react-router-dom';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import './Dnd.css'; // Import your CSS file
import { db } from './Firebase';

export default function Todo() {
    const [forms, setForms] = useState([]);
    const navigate = useNavigate();

    const [columns, setColumns] = useState({
        todo: { name: "To Do", items: [] },
        inProgress: { name: "In Progress", items: [] },
        done: { name: "Done", items: [] }
    });

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        date: '',
        priority: 'low'
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleData = async (e) => {
        e.preventDefault();
        const { title, description, date, priority } = formData;

        if (!title || !description || !date) {
            alert('Please fill in all the required fields.');
            return;
        }

        const newTask = { title, description, date, priority };
        try {
            const response = await set(ref(db, 'myData/' + title), newTask);
            alert('Data stored successfully!');
            setFormData({
                title: '',
                description: '',
                date: '',
                priority: 'low'
            });
            fetchData();
        } catch (err) {
            console.error(err);
            alert('Failed to store data. Please check console for details.');
        }
    };

    const handleClick = async () => {
        try {
            await signOut(auth);
            navigate('/login');
        } catch (err) {
            console.error(err);
            alert('Failed to sign out. Please try again.');
        }
    };

    const fetchData = async () => {
        const dbRef = ref(getDatabase());
        try {
            const snapshot = await get(child(dbRef, 'myData'));
            if (snapshot.exists()) {
                const data = snapshot.val();
                const tasksArray = Object.keys(data).map(key => ({ id: key, ...data[key] }));

                const updatedColumns = {
                    todo: { name: "To Do", items: tasksArray.filter(task => task.priority === 'low') },
                    inProgress: { name: "In Progress", items: tasksArray.filter(task => task.priority === 'medium') },
                    done: { name: "Done", items: tasksArray.filter(task => task.priority === 'high') }
                };

                setColumns(updatedColumns);
            } else {
                console.log("No data available");
            }
        } catch (error) {
            console.error(error);
        }
    };

    const onDragEnd = (result, columnId) => {
        if (!result.destination) return;
        const { source, destination } = result;
        const sourceColumn = columns[columnId];
        const copiedItems = [...sourceColumn.items];
        const [removed] = copiedItems.splice(source.index, 1);
        copiedItems.splice(destination.index, 0, removed);

        const updatedColumns = {
            ...columns,
            [columnId]: { ...sourceColumn, items: copiedItems }
        };

        setColumns(updatedColumns);
    };

    const handleAddForm = () => {
        const newForm = {
            id: forms.length + 1,
            title: formData.title,
            description: formData.description,
            date: formData.date,
            priority: formData.priority
        };

        setForms(prevForms => [...prevForms, newForm]);
        setFormData({
            title: '',
            description: '',
            date: '',
            priority: 'low'
        });
    };

    return (
        <div>
            <button onClick={handleClick} className="sign-out-btn">Sign Out</button>
            <div className='contain'>
                <div className='title'>
                    <label>
                        Task title:
                        <input type='text' name='title' value={formData.title} onChange={handleChange} required />
                        <button onClick={handleAddForm} className="add-more-btn">Add More</button>
                    </label>
                </div>
                <div className='tasks-container'>
                    {forms.map(form => (
                        <form key={form.id} className="task-form" onSubmit={handleData}>
                            <div style={{ display: 'flex', justifyContent: "center" }}>
                                <h3>{form.title}</h3>
                            </div>
                            <label>
                                Task Description:
                                <input type='text' name='description' value={form.description} onChange={handleChange} required />
                            </label>
                            <label>
                                Task due date:
                                <input type='date' name='date' value={form.date} onChange={handleChange} required />
                            </label>
                            <label>
                                Task priority:
                                <select name='priority' value={form.priority} onChange={handleChange}>
                                    <option value='low'>Low</option>
                                    <option value='medium'>Medium</option>
                                    <option value='high'>High</option>
                                </select>
                            </label>
                            <button type="submit" className="submit-btn">Add</button>
                            <div className='drag-drop-container'>
                                <DragDropContext onDragEnd={(result) => onDragEnd(result, 'todo')}>
                                    <div className="column">
                                        <p>To Do</p>
                                        <Droppable droppableId='todo'>
                                            {(provided, snapshot) => (
                                                <div
                                                    {...provided.droppableProps}
                                                    ref={provided.innerRef}
                                                    className={`droppable-col ${snapshot.isDraggingOver ? 'dragging-over' : ''}`}
                                                >
                                                    {columns.todo.items.map((item, index) => (
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
                                </DragDropContext>
                            </div>
                        </form>
                    ))}
                </div>
            </div>
        </div>
    );
}
