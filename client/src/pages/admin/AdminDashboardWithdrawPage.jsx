import React from "react";
import AdminHeader from "../../components/admin/layout/AdminHeader";
import AdminSidebar from "../../components/admin/layout/AdminSidebar";
import AdminAllWithdraw from "../../components/admin/AdminAllWithdraw";

const AdminDashboardWithdrawPage = () => {
  return (
    <div>
      <AdminHeader />
      <div className="flex items-start justify-between w-full">
        <div className="w-[80px] 800px:w-[330px]">
          <AdminSidebar active={7} />
        </div>
        <AdminAllWithdraw />
      </div>
    </div>
  );
};

export default AdminDashboardWithdrawPage;
