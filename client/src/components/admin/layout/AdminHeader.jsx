import React from 'react'
import { AiOutlineGift } from 'react-icons/ai'
import { BiMessageSquareDetail } from 'react-icons/bi'
import { FiPackage, FiShoppingBag } from 'react-icons/fi'
import { MdOutlineLocalOffer } from 'react-icons/md'
import { Link } from 'react-router-dom'
import { useSelector, useDispatch } from "react-redux";
import { RxDashboard } from 'react-icons/rx'
import { GrWorkshop } from 'react-icons/gr'
import { HiOutlineUserGroup } from 'react-icons/hi'
import { BsHandbag } from 'react-icons/bs'
import { CiMoneyBill } from 'react-icons/ci'

const AdminHeader = () => {
    const { currentUser } = useSelector((state) => state.user);
  return (
    <div className="w-full h-[80px] bg-white shadow sticky top-0 left-0 z-30 flex items-center justify-between px-4">
    <div>
      <Link to='/'>
        <img
          src="https://png.pngtree.com/png-vector/20190322/ourmid/pngtree-shop-logo-vector-template-design-illustration-png-image_860073.jpg"
          alt="logo"
          className="h-[80px] w-[150px] object-stretch rounded-3xl"
        />
      </Link>
    </div>
    <div className="items-center">
      <div className="flex items-center mr-4">
        <Link to="/admin/dashboard">
          <RxDashboard
            color="#555"
            size={25}
            className="mx-5 cursor-pointer 800px:block hidden"
          />
        </Link>

        <Link to="/admin/dashboard-orders">
          <FiShoppingBag
            color="#555"
            size={25}
            className="mx-5 cursor-pointer 800px:block hidden"
          />
        </Link>

        <Link to="/admin/dashboard-sellers">
          <GrWorkshop
            color="#555"
            size={25}
            className="mx-5 cursor-pointer 800px:block hidden"
          />
        </Link>

        <Link to="/admin/dashboard-orders">
          <FiPackage color="#555" size={25} className="mx-5 cursor-pointer 800px:block hidden" />
        </Link>

        <Link to="/admin/dashboard-users">
          <HiOutlineUserGroup
            color="#555"
            size={25}
            className="mx-5 cursor-pointer 800px:block hidden"
          />
        </Link>
        <Link to="/admin/dashboard-products">
          <BsHandbag
            color="#555"
            size={25}
            className="mx-5 cursor-pointer 800px:block hidden"
          />
        </Link>
        <Link to="/admin/dashboard-events">
          <MdOutlineLocalOffer
            color="#555"
            size={25}
            className="mx-5 cursor-pointer 800px:block hidden"
          />
        </Link>
        <Link to="/admin/dashboard-withdraw">
          <CiMoneyBill
            color="#555"
            size={25}
            className="mx-5 cursor-pointer 800px:block hidden"
          />
        </Link>
          <img
            src={currentUser?.avatar}
            alt="pp"
            className="h-[40px] w-[40px] object-cover rounded-full"
          />

      </div>
    </div>
  </div>
  )
}

export default AdminHeader