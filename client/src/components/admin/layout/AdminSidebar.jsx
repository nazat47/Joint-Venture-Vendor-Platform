import React from "react";
import { AiOutlineSetting } from "react-icons/ai";
import { BsHandbag } from "react-icons/bs";
import { CiMoneyBill } from "react-icons/ci";
import { FiShoppingBag } from "react-icons/fi";
import { GrWorkshop } from "react-icons/gr";
import { HiOutlineUserGroup } from "react-icons/hi";
import { MdOutlineLocalOffer } from "react-icons/md";
import { RxDashboard } from "react-icons/rx";
import { Link } from "react-router-dom";

const AdminSidebar = ({ active }) => {
  return (
    <div className="w-full h-[89vh] bg-white shadow-md overflow-y-scroll sticky top-0 left-0 z-10">
      <div className="w-full flex items-center p-4">
        <Link to="/admin/dashboard" className="w-full flex items-center">
          <RxDashboard size={30} color={`${active === 1 ? "blue" : "#555"}`} />
          <h5
            className={`hidden 800px:block pl-2 text-lg font-[600] ${
              active === 1
                ? "text-blue-800"
                : "text-gray-600  hover:text-blue-80"
            }`}
          >
            Dashboard
          </h5>
        </Link>
      </div>
      <div className="w-full flex items-center p-4">
        <Link to="/admin/dashboard-orders" className="w-full flex items-center">
          <FiShoppingBag
            size={30}
            color={`${active === 2 ? "blue" : "#555"}`}
          />
          <h5
            className={`hidden 800px:block pl-2 text-lg font-[600] ${
              active === 2
                ? "text-blue-800"
                : "text-gray-600  hover:text-blue-800"
            }`}
          >
            All Orders
          </h5>
        </Link>
      </div>
      <div className="w-full flex items-center p-4">
        <Link to="/admin/dashboard-sellers" className="w-full flex items-center">
          <GrWorkshop size={30} color={`${active === 3 ? "blue" : "#555"}`} />
          <h5
            className={`hidden 800px:block pl-2 text-lg font-[600] ${
              active === 3
                ? "text-blue-800"
                : "text-gray-600  hover:text-blue-800"
            }`}
          >
            All Sellers
          </h5>
        </Link>
      </div>
      <div className="w-full flex items-center p-4">
        <Link to="/admin/dashboard-users" className="w-full flex items-center">
          <HiOutlineUserGroup size={30} color={`${active === 4 ? "blue" : "#555"}`} />
          <h5
            className={`hidden 800px:block pl-2 text-lg font-[600] ${
              active === 4
                ? "text-blue-800"
                : "text-gray-600  hover:text-blue-800"
            }`}
          >
            All Users
          </h5>
        </Link>
      </div>
      <div className="w-full flex items-center p-4">
        <Link to="/admin/dashboard-products" className="w-full flex items-center">
          <BsHandbag size={30} color={`${active === 5 ? "blue" : "#555"}`} />
          <h5
            className={`hidden 800px:block pl-2 text-lg font-[600] ${
              active === 5
                ? "text-blue-800"
                : "text-gray-600  hover:text-blue-800"
            }`}
          >
            All Products
          </h5>
        </Link>
      </div>
      <div className="w-full flex items-center p-4">
        <Link to="/admin/dashboard-events" className="w-full flex items-center">
          <MdOutlineLocalOffer size={30} color={`${active === 6 ? "blue" : "#555"}`} />
          <h5
            className={`hidden 800px:block pl-2 text-lg font-[600] ${
              active === 6
                ? "text-blue-800"
                : "text-gray-600  hover:text-blue-800"
            }`}
          >
            All Events
          </h5>
        </Link>
      </div>
      <div className="w-full flex items-center p-4">
        <Link to="/admin/dashboard-withdraw" className="w-full flex items-center">
          <CiMoneyBill size={30} color={`${active === 7 ? "blue" : "#555"}`} />
          <h5
            className={`hidden 800px:block pl-2 text-lg font-[600] ${
              active === 7
                ? "text-blue-800"
                : "text-gray-600 hover:text-blue-800"
            }`}
          >
            Withdraw Requests
          </h5>
        </Link>
      </div>
      <div className="w-full flex items-center p-4">
        <Link to="/admin-profile" className="w-full flex items-center">
          <AiOutlineSetting size={30} color={`${active === 8 ? "blue" : "#555"}`} />
          <h5
            className={`hidden 800px:block pl-2 text-lg font-[600] ${
              active === 8
                ? "text-blue-800"
                : "text-gray-600 hover:text-blue-800"
            }`}
          >
            Settings
          </h5>
        </Link>
      </div>
    </div>
  );
};

export default AdminSidebar;
