import React from "react";
import { AiOutlineGift } from "react-icons/ai";
import { MdOutlineLocalOffer } from "react-icons/md";
import { FiPackage, FiShoppingBag } from "react-icons/fi";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { BiMessageSquareDetail } from "react-icons/bi";

const DashboardHeader = () => {
  const { currentShop } = useSelector((state) => state.shop);
  return (
    <div className="w-full h-[80px] bg-white shadow sticky top-0 left-0 z-30 flex items-center justify-between px-4">
      <div>
        <Link to="/">
          <img
            src="https://png.pngtree.com/png-vector/20190322/ourmid/pngtree-shop-logo-vector-template-design-illustration-png-image_860073.jpg"
            alt="logo"
            className="h-[80px] w-[150px] object-stretch rounded-3xl"
          />
        </Link>
      </div>
      <div className="items-center">
        <div className="flex items-center mr-4">
          <Link to="/dashboard-coupons">
            <AiOutlineGift
              color="#555"
              size={25}
              className="mx-5 cursor-pointer 800px:block hidden"
            />
          </Link>

          <Link to="/dashboard-events">
            <MdOutlineLocalOffer
              color="#555"
              size={25}
              className="mx-5 cursor-pointer 800px:block hidden"
            />
          </Link>

          <Link to="/dashboard-products">
            <FiShoppingBag
              color="#555"
              size={25}
              className="mx-5 cursor-pointer 800px:block hidden"
            />
          </Link>

          <Link to="/dashboard-orders">
            <FiPackage color="#555" size={25} className="mx-5 cursor-pointer 800px:block hidden" />
          </Link>

          <Link to="/dashboard-messages">
            <BiMessageSquareDetail
              color="#555"
              size={25}
              className="mx-5 cursor-pointer 800px:block hidden"
            />
          </Link>
          <Link to={`/shop/${currentShop._id}`}>
            <img
              src={currentShop?.avatar}
              alt="pp"
              className="h-[40px] w-[40px] object-cover rounded-full"
            />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default DashboardHeader;
