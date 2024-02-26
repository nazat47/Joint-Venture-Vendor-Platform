import React from "react";
import { AiOutlineFolder, AiOutlineGift } from "react-icons/ai";
import { FiPackage, FiShoppingBag } from "react-icons/fi";
import { MdOutlineLocalOffer } from "react-icons/md";
import { CiMoneyBill, CiSettings } from "react-icons/ci";
import { VscNewFile } from "react-icons/vsc";
import { RxDashboard } from "react-icons/rx";
import { Link } from "react-router-dom";
import { BiMessageSquareDetail } from "react-icons/bi";
import { HiOutlineReceiptRefund } from "react-icons/hi";

const DashboardSidebar = ({ active }) => {
  return (
    <div className="w-full h-[89vh] bg-white shadow-md overflow-y-scroll sticky top-0 left-0 z-10">
      <div className="w-full flex items-center p-4">
        <Link to="/dashboard" className="w-full flex items-center">
          <RxDashboard size={30} color={`${active === 1 ? "blue" : "#555"}`} />
          <h5
            className={`hidden 800px:block pl-2 text-lg font-[600] ${
              active === 1 ? "text-blue-800" : "text-gray-600  hover:text-blue-80"
            }`}
          >
            Dashboard
          </h5>
        </Link>
      </div>
      <div className="w-full flex items-center p-4">
        <Link to="/dashboard-orders" className="w-full flex items-center">
          <FiShoppingBag
            size={30}
            color={`${active === 2 ? "blue" : "#555"}`}
          />
          <h5
            className={`hidden 800px:block pl-2 text-lg font-[600] ${
              active === 2 ? "text-blue-800" : "text-gray-600  hover:text-blue-800"
            }`}
          >
            All Orders
          </h5>
        </Link>
      </div>
      <div className="w-full flex items-center p-4">
        <Link to="/dashboard-products" className="w-full flex items-center">
          <FiPackage size={30} color={`${active === 3 ? "blue" : "#555"}`} />
          <h5
            className={`hidden 800px:block pl-2 text-lg font-[600] ${
              active === 3 ? "text-blue-800" : "text-gray-600 hover:text-blue-800"
            }`}
          >
            Products
          </h5>
        </Link>
      </div>
      <div className="w-full flex items-center p-4">
        <Link
          to="/dashboard-create-products"
          className="w-full flex items-center"
        >
          <AiOutlineFolder
            size={30}
            color={`${active === 4 ? "blue" : "#555"}`}
          />
          <h5
            className={`hidden 800px:block pl-2 text-lg font-[600] ${
              active === 4 ? "text-blue-800" : "text-gray-600 hover:text-blue-800"
            }`}
          >
            Create Product
          </h5>
        </Link>
      </div>
      <div className="w-full flex items-center p-4">
        <Link to="/dashboard-events" className="w-full flex items-center">
          <MdOutlineLocalOffer
            size={30}
            color={`${active === 5 ? "blue" : "#555"}`}
          />
          <h5
            className={`hidden 800px:block pl-2 text-lg font-[600] ${
              active === 5 ? "text-blue-800" : "text-gray-600 hover:text-blue-800"
            }`}
          >
            Events
          </h5>
        </Link>
      </div>
      <div className="w-full flex items-center p-4">
        <Link to="/dashboard-create-event" className="w-full flex items-center">
          <VscNewFile size={30} color={`${active === 6 ? "blue" : "#555"}`} />
          <h5
            className={`hidden 800px:block pl-2 text-lg font-[600] ${
              active === 6 ? "text-blue-800" : "text-gray-600 hover:text-blue-800"
            }`}
          >
            Create event
          </h5>
        </Link>
      </div>
      <div className="w-full flex items-center p-4">
        <Link to="/dashboard-withdraw" className="w-full flex items-center">
          <CiMoneyBill size={30} color={`${active === 7 ? "blue" : "#555"}`} />
          <h5
            className={`hidden 800px:block pl-2 text-lg font-[600] ${
              active === 7 ? "text-blue-800" : "text-gray-600 hover:text-blue-800"
            }`}
          >
            Withdraw Money
          </h5>
        </Link>
      </div>
      <div className="w-full flex items-center p-4">
        <Link to="/dashboard-messages" className="w-full flex items-center">
          <BiMessageSquareDetail
            size={30}
            color={`${active === 8 ? "blue" : "#555"}`}
          />
          <h5
            className={`hidden 800px:block pl-2 text-lg font-[600] ${
              active === 8 ? "text-blue-800" : "text-gray-600 hover:text-blue-800"
            }`}
          >
            Inbox
          </h5>
        </Link>
      </div>
      <div className="w-full flex items-center p-4">
        <Link to="/dashboard-coupons" className="w-full flex items-center">
          <AiOutlineGift
            size={30}
            color={`${active === 9 ? "blue" : "#555"}`}
          />
          <h5
            className={`hidden 800px:block pl-2 text-lg font-[600] ${
              active === 9 ? "text-blue-800" : "text-gray-600 hover:text-blue-800"
            }`}
          >
            Discount Codes
          </h5>
        </Link>
      </div>
      <div className="w-full flex items-center p-4">
        <Link to="/dashboard-refunds" className="w-full flex items-center">
          <HiOutlineReceiptRefund
            size={30}
            color={`${active === 10 ? "blue" : "#555"}`}
          />
          <h5
            className={`hidden 800px:block pl-2 text-lg font-[600] ${
              active === 10 ? "text-blue-800" : "text-gray-600 hover:text-blue-800"
            }`}
          >
            Refunds
          </h5>
        </Link>
      </div>
      <div className="w-full flex items-center p-4">
        <Link to="/settings" className="w-full flex items-center">
          <CiSettings size={30} color={`${active === 11 ? "blue" : "#555"}`} />
          <h5
            className={`hidden 800px:block pl-2 text-lg font-[600] ${
              active === 11 ? "text-blue-800" : "text-gray-600 hover:text-blue-800"
            }`}
          >
            Settings
          </h5>
        </Link>
      </div>
    </div>
  );
};

export default DashboardSidebar;
