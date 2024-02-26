import React from 'react'
import DashboardHeader from '../../components/shop/layout/DashboardHeader'
import DashboardSidebar from '../../components/shop/layout/DashboardSidebar'
import AllRefunds from '../../components/shop/AllRefunds'

const ShopAllRefunds = () => {
  return (
    <div>
    <DashboardHeader />
    <div className="flex justify-between w-full">
      <div className="w-[80px] 800px:w-[330px]">
        <DashboardSidebar active={10} />
      </div>
      <div className="w-full justify-center flex">
        <AllRefunds />
      </div>
    </div>
  </div>
  )
}

export default ShopAllRefunds