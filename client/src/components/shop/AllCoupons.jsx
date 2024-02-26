import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import axios from "axios";
import { Button } from "@material-ui/core";
import { DataGrid } from "@material-ui/data-grid";
import { toast } from "react-toastify";
import {
  ProductFailure,
  ProductRequest,
  deleteProduct,
  getAllProducts,
} from "../../redux/reducers/productSlice";
import { AiOutlineDelete, AiOutlineEye } from "react-icons/ai";
import Loader from "../layout/Loader";
import styles from "../../styles/styles";
import { RxCross1 } from "react-icons/rx";

const AllCoupons = () => {
  const REACT_APP_BASE_URL = process.env.REACT_APP_BASE_URL;
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [value, setValue] = useState();
  const [minAmount, setMinAmount] = useState(null);
  const [maxAmount, setMaxAmount] = useState(null);
  const [selectedProd, setSelectedProd] = useState(null);
  const [couponLoading, setCouponLoading] = useState(false);
  const [coupons, setCoupons] = useState([]);
  const dispatch = useDispatch();
  const { currentShop } = useSelector((state) => state.shop);
  const { allProducts, loading } = useSelector((state) => state.product);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setCouponLoading(true);
      const { data } = await axios.post(`${REACT_APP_BASE_URL}/coupon/create`, {
        name,
        value,
        minAmount,
        maxAmount,
        shopId: currentShop._id,
        selectedProduct: selectedProd,
      });
      if (data?.msg) {
        toast.error("Unable to create coupon, try again later");
      }
      toast.success(data?.message);
      setOpen(false);
      setCouponLoading(false);
      window.location.reload();
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.msg);
    }
  };

  const handleDelete = async (id) => {
    try {
      const { data } = await axios.delete(
        `${REACT_APP_BASE_URL}/coupon/delete/${id}`
      );
      if (data.msg) {
        toast.error(data.msg);
      }
      toast.success(data.message);
      setCoupons(prevCoupons => prevCoupons.filter(coupon => coupon._id !== id));
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const getall = async () => {
      try {
        const { data } = await axios.get(
          `${REACT_APP_BASE_URL}/coupon/getAll/${currentShop._id}`
        );
        if (data?.msg) {
          toast.error(data.msg);
        }
        setCoupons(data);
        console.log(data);
      } catch (error) {
        toast.error(error.response.data.msg);
      }
    };
    getall();
  }, []);
  const columns = [
    { field: "id", headerName: "Coupon Id", minWidth: 150, flex: 0.7 },
    { field: "name", headerName: "Name", minWidth: 100, flex: 0.6 },
    {
      field: "discount",
      headerName: "Discount (%)",
      type: "number",
      minWidth: 100,
      flex: 0.5,
    },
    {
      field: "minAmount",
      headerName: "Min. Amount",
      type: "number",
      minWidth: 80,
      flex: 0.5,
    },

    {
      field: "maxAmount",
      headerName: "Min. Amount",
      type: "number",
      minWidth: 80,
      flex: 0.5,
    },
    {
      field: "selectedProd",
      headerName: "Selected Product",
      minWidth: 130,
      flex: 0.6,
    },
    {
      field: "Delete",
      flex: 0.5,
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
  coupons?.forEach((item) => {
    row.push({
      id: item._id,
      name: item.name,
      discount: item.value,
      minAmount: item.minAmount,
      maxAmount: item.maxAmount,
      selectedProd: item.selectedProduct,
    });
  });
  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <div className="w-full mx-8 pt-1 mt-10 bg-white">
          <div className="w-full flex justify-end">
            <div
              onClick={() => setOpen(true)}
              className={`${styles.button} !w-max !px-3 !rounded-md mr-3 !mb-3`}
            >
              <span className="text-white">Create Coupon Code</span>
            </div>
          </div>
          <DataGrid
            columns={columns}
            rows={row}
            pageSize={10}
            disableSelectionOnClick
            autoHeight
          />
          {open && (
            <div className="fixed top-0 left-0 w-full h-screen z-[2000] flex items-center justify-center bg-[#00000062]">
              <div className="800px:w-[50%] w-[90%] h-[80vh] bg-white rounded-md shadow-md">
                <div
                  onClick={() => setOpen(false)}
                  className="w-full flex justify-end p-3"
                >
                  <RxCross1 size={25} className="cursor-pointer" />
                </div>
                <h5 className="text-xl text-center font-Poppins">
                  Create coupon code
                </h5>
                <form onSubmit={handleSubmit} className="p-4">
                  <div>
                    <label className="pb-2">
                      Coupon name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={name}
                      required
                      placeholder="Enter your coupon name"
                      onChange={(e) => setName(e.target.value)}
                      className="mt-2 mb-3 appearance-none block text-gray-800 w-full px-3 h-[35px] border border-gray-300 rounded-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                  </div>
                  <div>
                    <label className="pb-2">
                      Discount <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="value"
                      value={value}
                      required
                      placeholder="Enter coupon discount value"
                      onChange={(e) => setValue(e.target.value)}
                      className="mt-2 mb-3 appearance-none block text-gray-800 w-full px-3 h-[35px] border border-gray-300 rounded-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                  </div>
                  <div>
                    <label className="pb-2">Minimum purchase amount</label>
                    <input
                      type="number"
                      name="minAmount"
                      value={minAmount}
                      placeholder="Optional"
                      onChange={(e) => setMinAmount(e.target.value)}
                      className="mt-2 mb-3 appearance-none block text-gray-800 w-full px-3 h-[35px] border border-gray-300 rounded-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                  </div>
                  <div>
                    <label className="pb-2">Maximum purchase amount</label>
                    <input
                      type="number"
                      name="maxAmount"
                      value={maxAmount}
                      placeholder="Optional"
                      onChange={(e) => setMaxAmount(e.target.value)}
                      className="mt-2 mb-3 appearance-none block text-gray-800 w-full px-3 h-[35px] border border-gray-300 rounded-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                  </div>
                  <br />
                  <div>
                    <label className="pb-2">Selected product</label>
                    <select
                      className="w-full mt-2 mb-3 border h-[35px] rounded-sm  text-gray-700"
                      value={selectedProd}
                      required
                      onChange={(e) => setSelectedProd(e.target.value)}
                    >
                      <option value="Choose a product" selected={true}>
                        Choose a product
                      </option>
                      {allProducts.map((prod) => (
                        <option value={prod.name} key={prod.title}>
                          {prod.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <br />
                  <div>
                    <input
                      type="submit"
                      disabled={couponLoading}
                      value={`${
                        couponLoading ? "Loading..." : "Create coupon"
                      }`}
                      className="mt-2 mb-3 appearance-none block text-gray-800 font-bold w-full px-3 h-[35px] border border-gray-700 rounded-smhover:outline-none cursor-pointer hover:text-white hover:border-black-700 hover:bg-gray-800 sm:text-sm"
                    />
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default AllCoupons;
