import React from 'react'
import AdminHeader from '../../components/admin/layout/AdminHeader'
import AdminSidebar from '../../components/admin/layout/AdminSidebar'
import AdminAllEvents from '../../components/admin/AdminAllEvents'

const AdminDashboardEventsPage = () => {
  return (
    <div>
    <AdminHeader />
    <div className="flex items-start justify-between w-full">
      <div className="w-[80px] 800px:w-[330px]">
        <AdminSidebar active={6} />
      </div>
     <AdminAllEvents />
    </div>
  </div>
  )
}

export default AdminDashboardEventsPage