import React from 'react'
import AdminSidebar from '../../Components/AdminSidebar/Sidebar'
import TaskForm from '../../Components/AdminTaskForm/TaskForm'

const Task = () => {
  return (
   <>
  <section style={{display:"flex",justifyContent:""}}>
     <AdminSidebar/>
     <TaskForm/>
  </section>
   </>
  )
}

export default Task
