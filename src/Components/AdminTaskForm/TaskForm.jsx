import React, { useState } from 'react'
import { MdOutlineTaskAlt } from "react-icons/md";
import axios from "axios"
import Swal from "sweetalert2"

const TaskForm = () => {
    const [formData, setFormData] = useState({
        employeeId: "",
        projectname: "",
        startDate: "",
        taskoverview: "",
        priority: "",
        expectedEndDate: "",
        projectManager: ""
    })

    const priority = ['low', 'medium', 'high']

    const formatDateToDDMMYYYY = (dateStr) => {
        if (!dateStr) return "";
        const [year, month, day] = dateStr.split("-");
        return `${day}-${month}-${year}`;
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!formData.employeeId || !formData.expectedEndDate || !formData.priority || 
            !formData.projectManager || !formData.projectname || !formData.startDate || 
            !formData.taskoverview) {
            return Swal.fire('All fields are required')
        }
        try {
            const payload = {
                ...formData,
                startDate: formatDateToDDMMYYYY(formData.startDate),
                expectedEndDate: formatDateToDDMMYYYY(formData.expectedEndDate),
            };

            const response = await axios.post('https://attendancemanagementbackend-oqfl.onrender.com/api/task/assign-task', payload, {
                headers: {
                    "Content-Type": "application/json"
                }
            })
            console.log('response for assign task', response)
            Swal.fire('Task Assigned Successfully')
            setFormData({
                employeeId: "",
                expectedEndDate: "",
                startDate: "",
                priority: "",
                projectManager: "",
                projectname: "",
                taskoverview: ""
            })
        } catch (error) {
            console.log('error', error)
            return Swal.fire('Internal server error')
        }
    }

    return (
        <>
            <section style={{ height: "80vh", width: "100vw", padding: "10px" }}>
                {/* Header */}
                <div style={{ paddingTop: "10px", paddingLeft: "4px", display: "flex", gap: "20px", alignItems: "center", marginBottom: "30px" }}>
                    <div>
                        <MdOutlineTaskAlt style={{ fontSize: "32px", color: "#4CAF50" }} />
                    </div>
                    <div>
                        <h2 style={{ margin: 0, color: "#333" }}>Assign Task <span style={{ color: "#4CAF50" }}>To Employees</span></h2>
                    </div>
                </div>

                {/* Form Container */}
                <div style={{ maxWidth: "600px", margin: "0 auto", backgroundColor: "white", padding: "30px", borderRadius: "12px", boxShadow: "0 2px 10px rgba(0,0,0,0.1)" }}>
                    <form onSubmit={handleSubmit}>

                        {/* Employee ID */}
                        <div style={{ marginBottom: "20px" }}>
                            <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", color: "#333" }}>
                                Employee ID
                            </label>
                            <input
                                type="text"
                                name='employeeId'
                                value={formData.employeeId}
                                onChange={handleChange}
                                placeholder="Enter employee ID"
                                style={{
                                    width: "100%",
                                    padding: "10px",
                                    border: "1px solid #ddd",
                                    borderRadius: "6px",
                                    fontSize: "14px",
                                    boxSizing: "border-box"
                                }}
                            />
                        </div>

                        {/* Project Name */}
                        <div style={{ marginBottom: "20px" }}>
                            <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", color: "#333" }}>
                                Project Name
                            </label>
                            <input
                                type="text"
                                name='projectname'
                                value={formData.projectname}
                                onChange={handleChange}
                                placeholder="Enter project name"
                                style={{
                                    width: "100%",
                                    padding: "10px",
                                    border: "1px solid #ddd",
                                    borderRadius: "6px",
                                    fontSize: "14px",
                                    boxSizing: "border-box"
                                }}
                            />
                        </div>

                        {/* Starting Date */}
                        <div style={{ marginBottom: "20px" }}>
                            <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", color: "#333" }}>
                                Starting Date
                            </label>
                            <input
                                type="date"
                                name='startDate'
                                value={formData.startDate}
                                onChange={handleChange}
                                style={{
                                    width: "100%",
                                    padding: "10px",
                                    border: "1px solid #ddd",
                                    borderRadius: "6px",
                                    fontSize: "14px",
                                    boxSizing: "border-box"
                                }}
                            />
                        </div>

                        {/* Expected End Date */}
                        <div style={{ marginBottom: "20px" }}>
                            <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", color: "#333" }}>
                                Expected End Date
                            </label>
                            <input
                                type="date"
                                name='expectedEndDate'
                                value={formData.expectedEndDate}
                                onChange={handleChange}
                                style={{
                                    width: "100%",
                                    padding: "10px",
                                    border: "1px solid #ddd",
                                    borderRadius: "6px",
                                    fontSize: "14px",
                                    boxSizing: "border-box"
                                }}
                            />
                        </div>

                        {/* Project Manager */}
                        <div style={{ marginBottom: "20px" }}>
                            <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", color: "#333" }}>
                                Project Manager
                            </label>
                            <input
                                type="text"
                                name='projectManager'
                                value={formData.projectManager}
                                onChange={handleChange}
                                placeholder="Enter project manager name"
                                style={{
                                    width: "100%",
                                    padding: "10px",
                                    border: "1px solid #ddd",
                                    borderRadius: "6px",
                                    fontSize: "14px",
                                    boxSizing: "border-box"
                                }}
                            />
                        </div>

                        {/* Task Overview */}
                        <div style={{ marginBottom: "20px" }}>
                            <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", color: "#333" }}>
                                Task Overview
                            </label>
                            <textarea
                                rows="4"
                                placeholder="Describe the task details..."
                                name='taskoverview'
                                value={formData.taskoverview}
                                onChange={handleChange}
                                style={{
                                    width: "100%",
                                    padding: "10px",
                                    border: "1px solid #ddd",
                                    borderRadius: "6px",
                                    fontSize: "14px",
                                    resize: "vertical",
                                    boxSizing: "border-box"
                                }}
                            />
                        </div>

                        {/* Priority */}
                        <div style={{ marginBottom: "25px" }}>
                            <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", color: "#333" }}>
                                Priority
                            </label>
                            <select
                                name='priority'
                                value={formData.priority}
                                onChange={handleChange}
                                style={{
                                    width: "100%",
                                    padding: "10px",
                                    border: "1px solid #ddd",
                                    borderRadius: "6px",
                                    fontSize: "14px",
                                    boxSizing: "border-box",
                                    backgroundColor: "white"
                                }}
                            >
                                <option value="">-- Select Priority --</option>
                                {priority.map((item) => (
                                    <option key={item} value={item}>
                                        {item.charAt(0).toUpperCase() + item.slice(1)}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            style={{
                                width: "100%",
                                padding: "12px",
                                backgroundColor: "#4CAF50",
                                color: "white",
                                border: "none",
                                borderRadius: "6px",
                                fontSize: "16px",
                                fontWeight: "600",
                                cursor: "pointer"
                            }}
                        >
                            Assign Task
                        </button>
                    </form>
                </div>
            </section>
        </>
    )
}

export default TaskForm