import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { MdAssignment, MdDateRange, MdPerson, MdPriorityHigh, MdCheckCircle, MdPending } from "react-icons/md";

const Cards = () => {
const [data,setData] = useState([])
const [error,setError] = useState(false)
const [loading,setLoading] = useState(true)

useEffect(()=>{
    const fetchTaskData = async()=>{
        try{
            const response = await axios.get('https://attendancemanagementbackend-oqfl.onrender.com/api/task/get-alltask')
            console.log('response for task asign',response.data.tasks)
            setData(response.data.tasks)
        }catch(error){
            console.log(error)
            
        }
    }
    fetchTaskData()
},[])

  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'high': return { bg: '#ffebee', color: '#c62828', icon: '#c62828' }
      case 'medium': return { bg: '#fff3e0', color: '#ef6c00', icon: '#ef6c00' }
      case 'low': return { bg: '#e8f5e9', color: '#2e7d32', icon: '#2e7d32' }
      default: return { bg: '#e3f2fd', color: '#1565c0', icon: '#1565c0' }
    }
  }

  const getStatusIcon = (status) => {
    switch(status) {
      case 'completed': return <MdCheckCircle style={{ color: '#4caf50' }} />
      case 'in-progress': return <MdPending style={{ color: '#ff9800' }} />
      default: return <MdPending style={{ color: '#9e9e9e' }} />
    }
  }

  const getStatusText = (status) => {
    switch(status) {
      case 'completed': return 'Completed'
      case 'in-progress': return 'In Progress'
      default: return 'Pending'
    }
  }

  return (
    <div style={{ 
      padding: "40px 20px", 
      backgroundColor: "#f0f2f5", 
      minHeight: "100vh" 
    }}>
      {/* Header */}
      <div style={{ 
        maxWidth: "1200px", 
        margin: "0 auto", 
        marginBottom: "40px" 
      }}>
        <h1 style={{ 
          fontSize: "32px", 
          color: "#1a1a1a", 
          marginBottom: "10px",
          fontWeight: "700"
        }}>
         All Employees Task
        </h1>
        <p style={{ color: "#666", fontSize: "16px" }}>
          Track and manage all your tasks in one place
        </p>
      </div>

      {/* Cards Grid */}
      <div style={{
        maxWidth: "1200px",
        margin: "0 auto",
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))",
        gap: "24px"
      }}>
        {data.map((task,index) => {
          const priorityStyle = getPriorityColor(task.priority)
          return (
            <div
              key={task.index}
              style={{
                backgroundColor: "white",
                borderRadius: "16px",
                overflow: "hidden",
                boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                transition: "transform 0.3s ease, box-shadow 0.3s ease",
                cursor: "pointer"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-5px)"
                e.currentTarget.style.boxShadow = "0 8px 15px rgba(0,0,0,0.15)"
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)"
                e.currentTarget.style.boxShadow = "0 4px 6px rgba(0,0,0,0.1)"
              }}
            >
            
              <div style={{
                padding: "20px",
                borderBottom: "1px solid #f0f0f0",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center"
              }}>
                <div style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px"
                }}>
                  <MdAssignment style={{ fontSize: "24px", color: "#4caf50" }} />
                  <h3 style={{ fontSize: "18px", fontWeight: "600", color: "#333", margin: 0 }}>
                    {task.employeeId}
                  </h3>
                </div>
                <div style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "5px",
                  backgroundColor: priorityStyle.bg,
                  padding: "4px 10px",
                  borderRadius: "20px"
                }}>
                  <MdPriorityHigh style={{ color: priorityStyle.icon, fontSize: "14px" }} />
                  <span style={{ fontSize: "12px", fontWeight: "600", color: priorityStyle.color, textTransform: "capitalize" }}>
                    {task.priority}
                  </span>
                </div>
              </div>

             
              <div style={{ padding: "20px" }}>
                <div style={{ marginBottom: "15px" }}>
                  <p style={{ fontSize: "14px", color: "#666", lineHeight: "1.5", margin: 0 }}>
                    {task.overview}
                  </p>
                </div>

                <div style={{ marginBottom: "12px", display: "flex", alignItems: "center", gap: "10px" }}>
                  <MdPerson style={{ color: "#999", fontSize: "16px" }} />
                  <span style={{ fontSize: "14px", color: "#555" }}>
                    <strong>Project Name:</strong> <span style={{color:"blue",fontWeight:"bold"}}>{task.projectname}</span>
                  </span>
                </div>

                <div style={{ marginBottom: "12px", display: "flex", alignItems: "center", gap: "10px" }}>
                  <MdDateRange style={{ color: "#999", fontSize: "16px" }} />
                  <span style={{ fontSize: "14px", color: "#555" }}>
                    <strong>Started Date:</strong> {new Date(task.startDate).toLocaleDateString()}
                  </span>
                </div>
                 <div style={{ marginBottom: "12px", display: "flex", alignItems: "center", gap: "10px" }}>
                  <MdDateRange style={{ color: "#999", fontSize: "16px" }} />
                  <span style={{ fontSize: "14px", color: "#555" }}>
                    <strong>Ending Date:</strong> {new Date(task.expectedEndDate).toLocaleDateString()}
                  </span>
                </div>

              <div style={{ marginBottom: "12px", display: "flex", alignItems: "center", gap: "10px" }}>
                  <MdPerson style={{ color: "#999", fontSize: "16px" }} />
                  <span style={{ fontSize: "14px", color: "#555" }}>
                    <strong>Task OverView:</strong> <span style={{color:"blue",fontWeight:"bold"}}>{task.taskoverview}</span>
                  </span>
                </div>
              </div>

               <div style={{ marginBottom: "12px", display: "flex", alignItems: "center", gap: "10px" }}>
                  <MdPerson style={{ color: "#999", fontSize: "16px" }} />
                  <span style={{ fontSize: "14px", color: "#555" }}>
                    <strong>Project Manager:</strong> <span style={{color:"blue",fontWeight:"bold"}}>{task.projectManager}</span>
                  </span>
                </div>
            </div>
          )
        })}
      </div>

     
    </div>
  )
}

export default Cards