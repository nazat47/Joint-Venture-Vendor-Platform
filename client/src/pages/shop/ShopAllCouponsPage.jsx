import React from 'react'
import DashboardHeader from '../../components/shop/layout/DashboardHeader'
import DashboardSidebar from '../../components/shop/layout/DashboardSidebar'
import AllProducts from '../../components/shop/AllProducts'
import AllCoupons from '../../components/shop/AllCoupons'

const ShopAllCouponsPage = () => {
  return (
    <div>
    <DashboardHeader />
    <div className="flex justify-between w-full">
      <div className="w-[80px] 800px:w-[330px]">
        <DashboardSidebar active={9} />
      </div>
      <div className="w-full justify-center flex">
        <AllCoupons />
      </div>
    </div>
  </div>
  )
}

export default ShopAllCouponsPage