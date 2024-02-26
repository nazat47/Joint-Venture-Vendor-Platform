import React from 'react'
import AdminHeader from '../../components/admin/layout/AdminHeader'
import AdminSidebar from '../../components/admin/layout/AdminSidebar'
import AdminAllUsers from '../../components/admin/AdminAllUsers'

const AdminDashboardUsersPage = () => {
  return (
    <div>
    <AdminHeader />
    <div className="flex items-start justify-between w-full">
      <div className="w-[80px] 800px:w-[330px]">
        <AdminSidebar active={4} />
      </div>
     <AdminAllUsers />
    </div>
  </div>
  )
}

export default AdminDashboardUsersPage