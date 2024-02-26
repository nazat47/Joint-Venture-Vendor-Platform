import React from "react";
import AdminHeader from "../../components/admin/layout/AdminHeader";
import AdminSidebar from "../../components/admin/layout/AdminSidebar";
import AdminAllShops from "../../components/admin/AdminAllShops";

const AdminDashboardShopsPage = () => {
  return (
    <div>
      <AdminHeader />
      <div className="flex items-start justify-between w-full">
        <div className="w-[80px] 800px:w-[330px]">
          <AdminSidebar active={3} />
        </div>
        <AdminAllShops />
      </div>
    </div>
  );
};

export default AdminDashboardShopsPage;
