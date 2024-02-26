import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import styles from "../../styles/styles";
import { BsCart3 } from "react-icons/bs";
import { Link } from "react-router-dom";
import { AiOutlineMoneyCollect } from "react-icons/ai";
import { MdBorderClear } from "react-icons/md";
import { DataGrid } from "@material-ui/data-grid";
import axios from "axios";
import {
  OrderFailure,
  OrderRequest,
  getAllOrders,
} from "../../redux/reducers/orderSlice";
import {
  getAllShops,
  getAllShopsFailure,
  signInStart,
} from "../../redux/reducers/shopSlice";

const AdminDashboardMain = () => {
  const REACT_APP_BASE_URL = process.env.REACT_APP_BASE_URL;
  const { allOrders } = useSelector((state) => state.order);
  const { allShops } = useSelector((state) => state.shop);
  const dispatch = useDispatch();

  useEffect(() => {
    const getAdminShops = async () => {
      try {
        dispatch(signInStart());
        const { data } = await axios.get(`${REACT_APP_BASE_URL}/shop/getAll`);
        dispatch(getAllShops(data));
      } catch (error) {
        dispatch(getAllShopsFailure(error.message));
        console.log(error);
      }
    };

    const getAdminOrders = async () => {
      try {
        dispatch(OrderRequest());
        const { data } = await axios.get(
          `${REACT_APP_BASE_URL}/order/getAdminAll`,
        );
        dispatch(getAllOrders(data));
      } catch (error) {
        dispatch(OrderFailure(error.message));
        console.log(error);
      }
    };
    getAdminShops();
    getAdminOrders();
  }, []);
  const totalEarning = allOrders?.reduce(
    (acc, item) => (acc + item.totalPrice * 0.1),
    0
  );
  const adminBalance=totalEarning.toFixed(2)
  const columns = [
    { field: "id", headerName: "Order ID", minWidth: 150, flex: 0.7 },

    {
      field: "status",
      headerName: "Status",
      minWidth: 130,
      flex: 0.7,
      cellClassName: (params) => {
        return params.getValue(params.id, "status") === "Delivered"
          ? "greenColor"
          : "redColor";
      },
    },
    {
      field: "itemsQty",
      headerName: "Items Qty",
      type: "number",
      minWidth: 130,
      flex: 0.7,
    },

    {
      field: "total",
      headerName: "Total",
      type: "number",
      minWidth: 130,
      flex: 0.8,
    },
    {
      field: "date",
      headerName: "Order Date",
      type: "number",
      flex: 1,
    },
  ];
  const row = [];
  allOrders?.forEach((item) => {
    row.push({
      id: item?._id,
      itemsQty: item.cart?.length,
      total: "US$ " + item?.totalPrice,
      status: item?.status,
      date: item?.createdAt?.slice(0, 10),
    });
  });
  return (
    <div className="w-full p-4">
      {/* {loading ? (
        <Loader />
      ) : ( */}
      <>
        <h3 className="text-[22px] pb-2">Overview</h3>
        <div className="w-full block 800px:flex items-center justify-between">
          <div className="w-full mb-4 800px:w-[30%] min-h-[20vh] bg-white shadow-md rounded px-2 py-5">
            <div className="flex items-center">
              <AiOutlineMoneyCollect
                size={30}
                className="mr-2"
                fill="#00000085"
              />
              <h3
                className={`${styles.productTitle} !text-lg leading-5 !font-[400] text-gray-600`}
              >
                Total Earning
              </h3>
            </div>
            <h5 className="pt-2 pl-[36px] text-[22px] font-[500]">{adminBalance}</h5>
          </div>
          <div className="w-full mb-4 800px:w-[30%] min-h-[20vh] bg-white shadow-md rounded px-2 py-5">
            <div className="flex items-center">
              <MdBorderClear size={30} className="mr-2" fill="#00000085" />
              <h3
                className={`${styles.productTitle} !text-lg leading-5 !font-[400] text-gray-600`}
              >
                All Sellers
              </h3>
            </div>
            <h5 className="pt-2 pl-[36px] text-[22px] font-[500]">
              {allShops?.length}
            </h5>
            <Link to="/admin/dashboard-sellers">
              <h5 className="pt-4 pl-2 text-[#077f9c]">View Sellers</h5>
            </Link>
          </div>
          <div className="w-full mb-4 800px:w-[30%] min-h-[20vh] bg-white shadow-md rounded px-2 py-5">
            <div className="flex items-center">
              <BsCart3 size={30} className="mr-2" fill="#00000085" />
              <h3
                className={`${styles.productTitle} !text-lg leading-5 !font-[400] text-gray-600`}
              >
                All Orders
              </h3>
            </div>
            <h5 className="pt-2 pl-[36px] text-[22px] font-[500]">
              {allOrders.length}
            </h5>
            <Link to="/admin/dashboard-orders">
              <h5 className="pt-4 pl-2 text-[#077f9c]">View Orders</h5>
            </Link>
          </div>
          <br />
        </div>
        <h3 className="text-[22px] pb-2">Latest Orders</h3>
        <div className="w-full min-h-[45vh] shadow-md bg-white rounded">
          <DataGrid
            columns={columns}
            rows={row}
            pageSize={5}
            disableSelectionOnClick
            autoHeight
          />
        </div>
      </>
      {/* )} */}
    </div>
  );
};

export default AdminDashboardMain;
