import React, { useEffect, useState } from "react";
import { AiOutlineArrowRight, AiOutlineMoneyCollect } from "react-icons/ai";
import styles from "../../styles/styles";
import { Link } from "react-router-dom";
import { MdBorderClear } from "react-icons/md";
import { BsCart3 } from "react-icons/bs";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { Button } from "@material-ui/core";
import { DataGrid } from "@material-ui/data-grid";
import {
  OrderFailure,
  OrderRequest,
  getShopAllOrders,
} from "../../redux/reducers/orderSlice";
import {
  ProductFailure,
  ProductRequest,
  getShopAllProducts,
} from "../../redux/reducers/productSlice";
import axios from "axios";

const DashboardHero = () => {
  const REACT_APP_BASE_URL = process.env.REACT_APP_BASE_URL;
  const { currentShop } = useSelector((state) => state.shop);
  const { shopAllOrders } = useSelector((state) => state.order);
  const { shopAllProducts } = useSelector((state) => state.product);
  const dispatch = useDispatch();
  useEffect(() => {
    const getShopAll = async () => {
      try {
        dispatch(OrderRequest());
        const { data } = await axios.get(
          `${REACT_APP_BASE_URL}/order/getShopAll/${currentShop._id}`
        );
        if (data.msg) {
          dispatch(OrderFailure(data.msg));
          toast.error(data.msg);
        }
        dispatch(getShopAllOrders(data));
      } catch (error) {
        dispatch(OrderFailure(error.response));
        toast.error(error.response);
      }
    };
    const getProductAll = async () => {
      try {
        dispatch(ProductRequest());
        const { data } = await axios.get(
          `${REACT_APP_BASE_URL}/product/getAll/${currentShop._id}`
        );
        if (data.msg) {
          dispatch(ProductFailure(data.msg));
          toast.error(data.msg);
        }
        dispatch(getShopAllProducts(data));
      } catch (error) {
        dispatch(ProductFailure(error.response));
        toast.error(error.response);
      }
    };
    getShopAll();
    getProductAll();
  }, [dispatch]);

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
      field: " ",
      flex: 1,
      minWidth: 150,
      headerName: "",
      type: "number",
      sortable: false,
      renderCell: (params) => {
        return (
          <>
            <Link to={`/order/${params.id}`}>
              <Button>
                <AiOutlineArrowRight size={20} />
              </Button>
            </Link>
          </>
        );
      },
    },
  ];
  const row = [];
  shopAllOrders?.forEach((item) => {
    row.push({
      id: item._id,
      itemsQty: item.cart.length,
      total: "US$ " + item.totalPrice,
      status: item.status,
    });
  });
  return (
    <div className="w-full p-8">
      <h3 className="text-[22px] pb-2">
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
                Account Balance{" "}
                <span className="text-md">(with 10% service charge)</span>
              </h3>
            </div>
            <h5 className="pt-2 pl-[36px] text-[22px] font-[500]">
              {currentShop?.availableBalance}
            </h5>
            <Link to="/dashboard-withdraw">
              <h5 className="pt-4 pl-2 text-[#077f9c]">Withdraw money</h5>
            </Link>
          </div>
          <div className="w-full mb-4 800px:w-[30%] min-h-[20vh] bg-white shadow-md rounded px-2 py-5">
            <div className="flex items-center">
              <MdBorderClear size={30} className="mr-2" fill="#00000085" />
              <h3
                className={`${styles.productTitle} !text-lg leading-5 !font-[400] text-gray-600`}
              >
                All Orders
              </h3>
            </div>
            <h5 className="pt-2 pl-[36px] text-[22px] font-[500]">
              {shopAllOrders?.length}
            </h5>
            <Link to="/dashboard-orders">
              <h5 className="pt-4 pl-2 text-[#077f9c]">View Orders</h5>
            </Link>
          </div>
          <div className="w-full mb-4 800px:w-[30%] min-h-[20vh] bg-white shadow-md rounded px-2 py-5">
            <div className="flex items-center">
              <BsCart3 size={30} className="mr-2" fill="#00000085" />
              <h3
                className={`${styles.productTitle} !text-lg leading-5 !font-[400] text-gray-600`}
              >
                All Products
              </h3>
            </div>
            <h5 className="pt-2 pl-[36px] text-[22px] font-[500]">
              {shopAllProducts?.length}
            </h5>
            <Link to="/dashboard-products">
              <h5 className="pt-4 pl-2 text-[#077f9c]">View Products</h5>
            </Link>
          </div>
          <br />
        </div>
        <h3 className="text-[22px] pb-2">Latest Orders</h3>
        <div className="w-full min-h-[45vh] shadow-md bg-white rounded">
          <DataGrid
            columns={columns}
            rows={row}
            pageSize={10}
            disableSelectionOnClick
            autoHeight
          />
        </div>
      </h3>
    </div>
  );
};

export default DashboardHero;
