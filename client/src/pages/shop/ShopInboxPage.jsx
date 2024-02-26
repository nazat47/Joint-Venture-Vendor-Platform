import React from "react";
import ShopMessages from "../../components/shop/ShopMessages";
import DashboardHeader from "../../components/shop/layout/DashboardHeader";
import DashboardSidebar from "../../components/shop/layout/DashboardSidebar";

const ShopInboxPage = () => {
  return (
    <div>
      <DashboardHeader />
      <div className="flex items-start justify-between w-full">
        <div className="w-[80px] 800px:w-[330px]">
          <DashboardSidebar active={8} />
        </div>
        <ShopMessages />
      </div>
    </div>
  );
};

export default ShopInboxPage;
