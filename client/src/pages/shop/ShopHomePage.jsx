import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import styles from "../../styles/styles";
import ShopInfo from "../../components/shop/ShopInfo";
import ShopProfileData from "../../components/shop/ShopProfileData";

const ShopHomePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentShop } = useSelector((state) => state.shop);
  useEffect(() => {
    if (currentShop._id !== id) {
      navigate(`/login-shop`);
    }
  }, []);
  return (
    <div className={`${styles.section} bg-[#eff1f3]`}>
      <div className="w-full 800px:flex justify-between space-x-4 py-10">
        <div className="w-full 800px:w-[300px] bg-white rounded-sm shadow-md overflow-y-scroll 800px:h-[90vh] 800px:sticky 800px:top-10 left-0 z-10">
          <ShopInfo isOwner={true} />
        </div>
        <div className="w-[100%] 800px:w-full rounded-xl">
          <ShopProfileData isOwner={true} />
        </div>
      </div>
    </div>
  );
};

export default ShopHomePage;
