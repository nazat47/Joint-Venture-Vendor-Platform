import React from 'react'
import AdminHeader from '../../components/admin/layout/AdminHeader'
import AdminSidebar from '../../components/admin/layout/AdminSidebar'
import AdminAllProducts from '../../components/admin/AdminAllProducts'

const AdminDashboardProductsPage = () => {
  return (
    <div>
    <AdminHeader />
    <div className="flex items-start justify-between w-full">
      <div className="w-[80px] 800px:w-[330px]">
        <AdminSidebar active={5} />
      </div>
      <AdminAllProducts />
    </div>
  </div>
  )
}

export default AdminDashboardProductsPage