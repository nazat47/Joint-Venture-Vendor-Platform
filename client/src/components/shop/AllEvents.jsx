import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import axios from "axios";
import { Button } from "@material-ui/core";
import { DataGrid } from "@material-ui/data-grid";
import { toast } from "react-toastify";
import { AiOutlineDelete, AiOutlineEye } from "react-icons/ai";
import Loader from "../layout/Loader";
import {
  EventFailure,
  EventRequest,
  deleteEvent,
  getShopAllEvents,
} from "../../redux/reducers/eventSlice";

const AllEvents = () => {
  const REACT_APP_BASE_URL = process.env.REACT_APP_BASE_URL;
  const dispatch = useDispatch();
  const { currentShop } = useSelector((state) => state.shop);
  const { shopAllEvents, loading } = useSelector((state) => state.event);

  const handleDelete = async (id) => {
    try {
      const { data } = await axios.delete(
        `${REACT_APP_BASE_URL}/event/delete/${id}`
      );
      if (data.msg) {
        toast.error(data.msg);
      }
      toast.success(data.message);
      dispatch(deleteEvent(id));
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const getall = async () => {
      try {
        dispatch(EventRequest());
        const { data } = await axios.get(
          `${REACT_APP_BASE_URL}/event/getAll/${currentShop._id}`
        );
        // if (data?.msg) {
        //   dispatch(EventFailure(data?.msg));
        //   toast.error(data.msg);
        // }
        dispatch(getShopAllEvents(data));
      } catch (error) {
        console.log(error);
      }
    };
    getall();
  }, [shopAllEvents]);
  const columns = [
    { field: "id", headerName: "Event Id", minWidth: 150, flex: 0.7 },
    { field: "name", headerName: "Name", minWidth: 100, flex: 0.5 },
    {
      field: "price",
      headerName: "Price",
      type: "number",
      minWidth: 100,
      flex: 0.3,
    },
    {
      field: "stock",
      headerName: "Stock",
      type: "number",
      minWidth: 80,
      flex: 0.5,
    },
    {
      field: "startDate",
      headerName: "Start Date",
      type: "number",
      minWidth: 80,
      flex: 0.5,
    },
    {
      field: "finishDate",
      headerName: "End Date",
      type: "number",
      minWidth: 80,
      flex: 0.5,
    },
    { field: "sold", headerName: "Sold out", minWidth: 130, flex: 0.6 },
    {
      field: "preview",
      headerName: "",
      minWidth: 100,
      flex: 0.4,
      type: "number",
      sortable: false,
      renderCell: (params) => {
        return (
          <>
            <Link to={`/product/${params.id}?isEvent=true`}>
              <Button>
                <AiOutlineEye size={20} />
              </Button>
            </Link>
          </>
        );
      },
    },
    {
      field: "Delete",
      flex: 0.3,
      minWidth: 120,
      headerName: "",
      type: "number",
      sortable: false,
      renderCell: (params) => {
        return (
          <>
            <Button onClick={() => handleDelete(params.id)}>
              <AiOutlineDelete size={20} className="hover:text-red-500" />
            </Button>
          </>
        );
      },
    },
  ];
  const row = [];
  shopAllEvents?.forEach((item) => {
    row.push({
      id: item._id,
      name: item.name,
      price: item.discountPrice,
      stock: item.stock,
      sold: 10,
      startDate: item.startDate.slice(0, 10),
      finishDate: item.finishDate.slice(0, 10),
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

export default AllEvents;
