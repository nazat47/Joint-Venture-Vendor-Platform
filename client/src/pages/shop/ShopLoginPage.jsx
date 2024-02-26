import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import ShopLogin from "../../components/shop/ShopLogin";

const ShopLoginPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated, currentShop } = useSelector((state) => state.shop);
  useEffect(() => {
    if (isAuthenticated) {
      if (currentShop.role === "seller") {
        navigate(`/dashboard`);
      } else if (currentShop.role === "user") {
        navigate(`/`);
      }
    }
  }, []);
  return (
    <div>
      <ShopLogin />
    </div>
  );
};

export default ShopLoginPage;
