import React from "react";
import AdminHeader from "../../components/admin/layout/AdminHeader";
import AdminSidebar from "../../components/admin/layout/AdminSidebar";
import AdminDashboardMain from "../../components/admin/AdminDashboardMain";

const AdminDashboardPage = () => {
  return (
    <div>
      <AdminHeader />
      <div className="flex items-start justify-between w-full">
        <div className="w-[80px] 800px:w-[330px]">
          <AdminSidebar active={1} />
        </div>
       <AdminDashboardMain />
      </div>
    </div>
  );
};

export default AdminDashboardPage;
