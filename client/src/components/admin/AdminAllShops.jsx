import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import {
    getAllShops,
    getAllShopsFailure,
    signInStart,
  } from "../../redux/reducers/shopSlice";
import { DataGrid } from "@material-ui/data-grid";
import { Button } from "@material-ui/core";
import axios from "axios";
import Loader from "../layout/Loader";
import { AiOutlineDelete } from "react-icons/ai";
import styles from "../../styles/styles";

const AdminAllShops = () => {
  const REACT_APP_BASE_URL = process.env.REACT_APP_BASE_URL;
  const { allShops,loading } = useSelector((state) => state.shop);
  const [open, setOpen] = useState(false);
  const [userId, setUserId] = useState("");
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
    getAdminShops();
  }, []);

  const handleDelete = async (id) => {
    try {
      const { data } = await axios.delete(
        `${REACT_APP_BASE_URL}/shop/delete/${id}`
      );
      if (data.msg) {
        toast.error(data.msg);
      }
      toast.success("Shop deleted");
    } catch (error) {
      toast.error(error.response.data?.msg);
      console.log(error);
    }
    try {
      dispatch(signInStart());
      const { data } = await axios.get(`${REACT_APP_BASE_URL}/shops/getAll`);
      dispatch(getAllShops(data));
    } catch (error) {
      dispatch(getAllShopsFailure(error.message));
      console.log(error);
    }
  };

  const columns = [
    { field: "id", headerName: "Order ID", minWidth: 150, flex: 0.7 },

    {
      field: "email",
      headerName: "Email",
      minWidth: 130,
      flex: 0.7,
    },
    {
      field: "name",
      headerName: "Shop name",
      type: "text",
      minWidth: 120,
      flex: 0.7,
    },
    {
      field: "role",
      headerName: "User Role",
      type: "text",
      minWidth: 130,
      flex: 0.8,
    },
    {
      field: "joinedAt",
      headerName: "Date Joined",
      type: "date",
      minWidth: 130,
      flex: 0.8,
    },

    {
      field: " ",
      flex: 1,
      minWidth: 30,
      headerName: "",
      sortable: false,
      renderCell: (params) => {
        return (
          <>
            <Button onClick={() => setUserId(params.id) || setOpen(true)}>
              <AiOutlineDelete
                size={20}
                className="cursor-pointer hover:text-red-500"
              />
            </Button>
          </>
        );
      },
    },
  ];
  const row = [];
  allShops?.forEach((item) => {
    row.push({
      id: item?._id,
      email: item?.email,
      name: item?.name,
      role: item?.role,
      joinedAt: item?.createdAt.slice(0, 10),
    });
  });
  return (
    <div className="w-full p-6">
      <h3 className="text-[22px] pb-2">Latest Orders</h3>
      {loading ? (
        <Loader />
      ) : (
        <>
          <div className="w-full min-h-[45vh] shadow-md bg-white rounded">
            <DataGrid
              columns={columns}
              rows={row}
              pageSize={5}
              disableSelectionOnClick
              autoHeight
            />
          </div>
          {open && (
            <div className="w-full fixed top-0 left-0 z-99 bg-[#00000039] flex items-center justify-center h-screen">
              <div className="w-[70%] 800px:w-[40%] min-h-[20vh] bg-white rounded shadow-md">
                <h3 className="text-xl text-center py-5 text-gray-700">
                  Are you sure to delete the user?
                </h3>
                <div className="w-full p-4 flex items-center justify-center space-x-6">
                  <div
                    onClick={() => setOpen(false) || handleDelete(userId)}
                    className={`${styles.button} !bg-red-500 text-white `}
                  >
                    Confirm
                  </div>
                  <div
                    onClick={() => setOpen(false)}
                    className={`${styles.button} !bg-green-500 text-white `}
                  >
                    Cancel
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default AdminAllShops;
