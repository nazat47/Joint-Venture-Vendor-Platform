import React, { useEffect, useState } from "react";
import { format } from "timeago.js";
import { toast } from "react-toastify";
import axios from "axios";
import { Button } from "@material-ui/core";
import { DataGrid } from "@material-ui/data-grid";
import { BsPencil } from "react-icons/bs";
import { RxCross1 } from "react-icons/rx";
import styles from "../../styles/styles";

const AdminAllWithdraw = () => {
  const REACT_APP_BASE_URL = process.env.REACT_APP_BASE_URL;
  const [data, setData] = useState();
  const [open, setOpen] = useState(false);
  const [withdrawData, setWithdrawData] = useState([]);
  const [status, setStatus] = useState("processing");
  useEffect(() => {
    const getAll = async () => {
      try {
        const { data } = await axios.get(
          `${REACT_APP_BASE_URL}/withdraw/getAll`
        );
        if (data.msg) {
          toast.error(data.msg);
        }
        setData(data);
      } catch (error) {
        toast.error(error.response.data.msg);
      }
    };
    getAll();
  }, [open]);
  console.log(status);
  const handleSubmit = async () => {
    try {
      const { data } = await axios.patch(
        `${REACT_APP_BASE_URL}/withdraw/update/${withdrawData.id}`,
        { status, shopId: withdrawData.shopid }
      );
      if (data.msg) {
        toast.error(data.msg);
      }
      toast.success("Status updated");
      setOpen(false);
    } catch (error) {
      toast.error(error.response.data.msg);
    }
  };
  const columns = [
    { field: "id", headerName: "Order ID", minWidth: 150, flex: 0.7 },

    {
      field: "name",
      headerName: "Name",
      minWidth: 130,
      flex: 0.7,
    },
    {
      field: "shopid",
      headerName: "Shop ID",
      minWidth: 130,
      flex: 0.7,
    },
    {
      field: "amount",
      headerName: "Amount",
      type: "text",
      minWidth: 120,
      flex: 0.7,
    },
    {
      field: "status",
      headerName: "Current Status",
      type: "text",
      minWidth: 130,
      flex: 0.8,
    },
    {
      field: "requestedDate",
      headerName: "Date Requested",
      type: "date",
      minWidth: 130,
      flex: 0.8,
    },
    {
      field: "",
      headerName: "Update Status",
      type: "number",
      minWidth: 80,
      flex: 0.5,
      renderCell: (params) => {
        if (params.row.status === "success") {
          return null;
        }
        return (
          <>
            <BsPencil
              size={20}
              className="cursor-pointer hover:text-blue-500 mr-4"
              onClick={() => setOpen(true) || setWithdrawData(params.row)}
            />
          </>
        );
      },
    },
  ];
  const row = [];
  data?.forEach((item) => {
    row.push({
      id: item?._id,
      name: item?.shop.name,
      shopid: item?.shop._id,
      amount: item?.amount,
      status: item?.status,
      requestedDate: format(item?.createdAt.slice(0, 10)),
    });
  });

  return (
    <div className="w-full mr-10">
      <div className="w-full min-h-[45vh] shadow-md bg-white rounded m-6">
        <DataGrid
          columns={columns}
          rows={row}
          pageSize={5}
          disableSelectionOnClick
          autoHeight
        />
      </div>
      {open && (
        <div className="w-full fixed top-0 left-0 bg-[#0000004e] flex items-center justify-center h-screen z-[999]">
          <div className="w-[50%] min-h-[40vh] p-4 bg-white shadow-md rounded">
            <div className="flex justify-end w-full">
              <RxCross1
                size={20}
                className="cursor-pointer"
                onClick={() => setOpen(false)}
              />
            </div>
            <h1 className="text-xl text-center ">Update withdraw status</h1>
            <select
              name=""
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-[200px] h-[35px] border rounded mt-5"
            >
              <option value={withdrawData.status}>{withdrawData.status}</option>
              <option value="success">Sucess</option>
            </select>
            <button
              onClick={handleSubmit}
              type="submit"
              className={`${styles.button} !h-42px] text-lg text-white bg-slate-800 hover:bg-slate-900 mx-auto mt-8`}
            >
              Update
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminAllWithdraw;
