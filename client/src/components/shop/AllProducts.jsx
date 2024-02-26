import React, { useEffect } from "react";
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
  getShopAllProducts,
} from "../../redux/reducers/productSlice";
import { AiOutlineDelete, AiOutlineEye } from "react-icons/ai";
import Loader from "../layout/Loader";

const AllProducts = () => {
  const REACT_APP_BASE_URL = process.env.REACT_APP_BASE_URL;
  const dispatch = useDispatch();
  const { currentShop } = useSelector((state) => state.shop);
  const { shopAllProducts, loading } = useSelector((state) => state.product);

  const handleDelete = async (id) => {
    const { data } = await axios.delete(
      `${REACT_APP_BASE_URL}/product/delete/${id}`
    );
    if (data.msg) {
      toast.error(data.msg);
    }
    toast.success(data.message);
    dispatch(deleteProduct(id));
  };

  useEffect(() => {
    const getall = async () => {
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
    getall();
  }, [shopAllProducts]);
  const columns = [
    { field: "id", headerName: "Product Id", minWidth: 150, flex: 0.7 },
    { field: "name", headerName: "Name", minWidth: 100, flex: 0.6 },
    {
      field: "price",
      headerName: "Price",
      type: "number",
      minWidth: 100,
      flex: 0.5,
    },
    {
      field: "stock",
      headerName: "Stock",
      type: "number",
      minWidth: 80,
      flex: 0.5,
    },
    { field: "sold", headerName: "Sold out", minWidth: 130, flex: 0.6 },
    {
      field: "preview",
      headerName: "",
      minWidth: 100,
      flex: 0.5,
      type: "number",
      sortable: false,
      renderCell: (params) => {
        return (
          <>
            <Link to={`/product/${params.id}`}>
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
      flex: 0.8,
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
  shopAllProducts?.forEach((item) => {
    row.push({
      id: item._id,
      name: item.name,
      price: item.discountPrice,
      stock: item.stock,
      sold: item.soldOut,
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

export default AllProducts;
