import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import axios from "axios";
import { Button } from "@material-ui/core";
import { DataGrid } from "@material-ui/data-grid";
import { toast } from "react-toastify";
import { AiOutlineArrowRight } from "react-icons/ai";
import Loader from "../layout/Loader";
import {
  OrderFailure,
  OrderRequest,
  getShopAllOrders,
} from "../../redux/reducers/orderSlice";

const AllOrders = () => {
  const REACT_APP_BASE_URL = process.env.REACT_APP_BASE_URL;
  const dispatch = useDispatch();
  const { currentShop } = useSelector((state) => state.shop);
  const { shopAllOrders, loading } = useSelector((state) => state.order);

  useEffect(() => {
    const getall = async () => {
      try {
        dispatch(OrderRequest());
        const { data } = await axios.get(
          `${REACT_APP_BASE_URL}/order/getShopAll/${currentShop._id}`
        );
        console.log(data);
        if (data.msg) {
          dispatch(OrderFailure(data.msg));
          toast.error(data.msg);
        } else {
          dispatch(getShopAllOrders(data));
        }
      } catch (error) {
        dispatch(OrderFailure(error.response));
        toast.error(error.response);
      }
    };
    getall();
  }, [shopAllOrders]);
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
    <>
      {/* {loading ? (
        <Loader />
      ) : ( */}
        <div className="w-full mx-8 pt-1 mt-10 bg-white">
          <DataGrid
            columns={columns}
            rows={row}
            pageSize={10}
            disableSelectionOnClick
            autoHeight
          />
        </div>
      {/* )} */}
    </>
  );
};

export default AllOrders;
