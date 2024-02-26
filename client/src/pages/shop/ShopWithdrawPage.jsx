import React from "react";
import DashboardHeader from "../../components/shop/layout/DashboardHeader";
import DashboardSidebar from "../../components/shop/layout/DashboardSidebar";
import ShopWithdraw from "../../components/shop/ShopWithdraw";

const ShopWithdrawPage = () => {
  return (
    <div>
      <DashboardHeader />
      <div className="flex items-start justify-between w-full">
        <div className="w-[80px] 800px:w-[330px]">
          <DashboardSidebar active={7} />
        </div>
        <ShopWithdraw />
      </div>
    </div>
  );
};

export default ShopWithdrawPage;
