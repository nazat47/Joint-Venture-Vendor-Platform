import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { DataGrid } from "@material-ui/data-grid";
import axios from "axios";
import {
  OrderFailure,
  OrderRequest,
  getAllOrders,
} from "../../redux/reducers/orderSlice";

const AdminAllOrders = () => {
  const REACT_APP_BASE_URL = process.env.REACT_APP_BASE_URL;
  const { allOrders } = useSelector((state) => state.order);
  const dispatch = useDispatch();
  useEffect(() => {
    const getAdminOrders = async () => {
      try {
        dispatch(OrderRequest());
        const { data } = await axios.get(
          `${REACT_APP_BASE_URL}/order/getAdminAll`
        );
        dispatch(getAllOrders(data));
      } catch (error) {
        dispatch(OrderFailure(error.message));
        console.log(error);
      }
    };
    getAdminOrders();
  }, []);
  const columns = [
    { field: "id", headerName: "Order ID", flex: 1, minWidth: 120 },

    {
      field: "status",
      headerName: "Status",
      minWidth: 120,
      flex: 1,
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
      minWidth: 120,
      flex: 1,
    },

    {
      field: "total",
      headerName: "Total",
      type: "number",
      minWidth: 120,
      flex: 1,
    },
    {
      field: "date",
      headerName: "Order Date",
      type: "number",
      minWidth: 120,
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
    <div className="m-8 w-full min-h-[45vh] shadow-md bg-white rounded">
      <DataGrid
        columns={columns}
        rows={row}
        pageSize={10}
        disableSelectionOnClick
        autoHeight
      />
    </div>
  );
};

export default AdminAllOrders;
