import React from 'react'
import AdminSidebar from '../../Components/AdminSidebar/Sidebar'
import AddEmployeee from '../../Components/AddEmployeeForm/AddEmployee'

const AddEmployee = () => {
  return (
    <section className='grid grid-cols-[250px_1fr]'>
      <AdminSidebar/>
      <div className='p-6'>
        <AddEmployeee/>
      </div>
    </section>
  )
}

export default AddEmployee