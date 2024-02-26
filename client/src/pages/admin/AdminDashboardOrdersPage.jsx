import React from 'react'
import AdminHeader from '../../components/admin/layout/AdminHeader'
import AdminSidebar from '../../components/admin/layout/AdminSidebar'
import AdminAllOrders from '../../components/admin/AdminAllOrders'

const AdminDashboardOrdersPage = () => {
  return (
    <div>
    <AdminHeader />
    <div className="flex items-start justify-between w-full">
      <div className="w-[80px] 800px:w-[330px]">
        <AdminSidebar active={2} />
      </div>
      <AdminAllOrders />
    </div>
  </div>
  )
}

export default AdminDashboardOrdersPage