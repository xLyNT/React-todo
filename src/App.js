import React, {useState, useEffect} from 'react';
import { CreateTask } from './components/CreateTask';
import {Header} from './components/Header';
import {Tasks} from './components/Tasks';

function App() {
  const [showAddTask, setShowAddTask] = useState(false); 
  const [tasks, setTasks] = useState ([]);

  useEffect(() => {

    async function getTasks(){

    const tasksFromServer = await fetchTasks();
    
    setTasks(tasksFromServer);
    }

    getTasks()
  },[])

  async function fetchTasks(){

    const res= await fetch('http://localhost:500/tasks');
    const data = await res.json();

    return data;
  }

 async function addTask (task) {
    console.log(task)
    const res = await fetch('http://localhost:500/tasks', {method:'POST', headers:{
      'Content-type':'application/json'
    },
    body:JSON.stringify(task)
  })

    const data = await res.json();;

    setTasks([...tasks, data ]);

  }

  async function deleteTask(id){

    
    await fetch(`http://localhost:500/tasks/${id}`, {method:'DELETE'})

    setTasks(tasks.filter(task => task.id !== id))

  }

  async function fetchTask(id){

    const res= await fetch(`http://localhost:500/tasks/${id}`);
    const data = await res.json();

    return data;

  }




  async function toggleImportant(id){

    const togglingTask = await fetchTask(id);
   
    const updTask = {...togglingTask, important:!togglingTask.important};

    const res = await fetch (`http://localhost:500/tasks/${id}`, {
      method:'PUT',
      headers:{
        'Content-type':'application/json'
      },
      body:JSON.stringify(updTask)
    })

    const data = await res.json();

    setTasks(tasks.map(task => task.id === id ? {...task, important:data.important} : task));


  }
  

  return (
    <div className = "container">
        <Header title = "Task list" onAdd = {() => setShowAddTask(!showAddTask)} showAdd={showAddTask}/>
        {showAddTask && <CreateTask onAdd = {addTask} />}
        <Tasks tasks = {tasks } onDelete = {deleteTask} onToggle = {toggleImportant}/>
    </div>
  );
}

export default App;
