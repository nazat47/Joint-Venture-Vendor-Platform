import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { DataGrid } from "@material-ui/data-grid";
import { toast } from "react-toastify";
import Loader from "../layout/Loader";
import { Button } from "@material-ui/core";
import {
  EventFailure,
  EventRequest,
  getAllEvents,
} from "../../redux/reducers/eventSlice";
import { AiOutlineEye } from "react-icons/ai";
import { Link } from "react-router-dom";

const AdminAllEvents = () => {
  const REACT_APP_BASE_URL = process.env.REACT_APP_BASE_URL;
  const dispatch = useDispatch();
  const { allEvents, loading } = useSelector((state) => state.event);

  useEffect(() => {
    const getall = async () => {
      try {
        dispatch(EventRequest());
        const { data } = await axios.get(`${REACT_APP_BASE_URL}/event/getAll`);
        if (data.msg) {
          dispatch(EventFailure(data.msg));
          toast.error(data.msg);
        }
        dispatch(getAllEvents(data));
      } catch (error) {
        dispatch(EventFailure(error.response.data.msg));
        toast.error(error.response.data.msg);
      }
    };
    getall();
  }, []);
  const columns = [
    { field: "id", headerName: "Event Id", flex: 1, minWidth: 120 },
    { field: "name", headerName: "Name", flex: 1, minWidth: 120 },
    {
      field: "price",
      headerName: "Price",
      type: "number",
      flex: 0.5,
      minWidth: 120,
    },
    {
      field: "stock",
      headerName: "Stock",
      type: "number",
      flex: 0.5,
      minWidth: 120,
    },
    {
      field: "startDate",
      headerName: "Start Date",
      flex: 0.5,
      minWidth: 120,
    },
    {
      field: "finishDate",
      headerName: "End Date",
      type: "number",
      minWidth: 120,
      flex: 0.5,
    },
    { field: "sold", headerName: "Sold out", flex: 0.5, minWidth: 120 },
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
  ];
  const row = [];
  allEvents?.forEach((item) => {
    row.push({
      id: item._id,
      name: item.name,
      price: item.discountPrice,
      stock: item.stock,
      sold: item.soldOut,
      startDate: item.startDate.slice(0, 10),
      finishDate: item.finishDate.slice(0, 10),
    });
  });
  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <div className="w-full mx-8 pt-1 mt-10 bg-white">
          <DataGrid
            columns={columns}
            rows={row}
            pageSize={10}
            disableSelectionOnClick
            autoHeight
          />
        </div>
      )}
    </>
  );
};

export default AdminAllEvents;
