import React from "react";
import DashboardHeader from "../../components/shop/layout/DashboardHeader";
import Footer from "../../components/layout/Footer";
import OrderDetails from "../../components/shop/OrderDetails";

const ShopOrderDetails = () => {
  return (
    <div>
      <DashboardHeader />
      <OrderDetails />
      <Footer />
    </div>
  );
};

export default ShopOrderDetails;
