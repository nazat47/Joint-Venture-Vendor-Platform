import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import styles from "../../styles/styles";
import { BsFillBagFill } from "react-icons/bs";
import { Link, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import {
  OrderFailure,
  OrderRequest,
  getShopAllOrders,
} from "../../redux/reducers/orderSlice";
import Loader from "../layout/Loader";

const OrderDetails = () => {
  const REACT_APP_BASE_URL = process.env.REACT_APP_BASE_URL;
  const { shopAllOrders, loading } = useSelector((state) => state.order);
  const { currentShop } = useSelector((state) => state.shop);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [status, setStatus] = useState("");
  const { id } = useParams();
console.log(status)
  useEffect(() => {
    const getall = async () => {
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
    getall();
  }, []);
  const order = shopAllOrders.find((order) => order._id === id);
  const orderUpdateHandler = async (id) => {
    try {
      const { data } = await axios.patch(
        `${REACT_APP_BASE_URL}/order/update/${id}`,
        { status }
      );
      if (data?.msg) {
        toast.error(data?.msg);
      } else {
        toast.success("Order status updated");
        navigate("/dashboard-orders");
      }
    } catch (error) {
      console.log(error.message);
    }
  };
  const refundHandler = async (id) => {
    try {
      const { data } = await axios.patch(
        `${REACT_APP_BASE_URL}/order/refund/accept/${id}`,
        { status, role: currentShop.role }
      );
      if (data.msg) {
        toast.error(data.msg);
      }
      toast.success("Order status updated");
      navigate("/dashboard-orders");
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className={`${styles.section} py-4 min-h-screen`}>
      {loading ? (
        <Loader />
      ) : (
        <>
          <div className="w-full flex items-center justify-between">
            <div className="flex items-center">
              <BsFillBagFill size={25} color="crimson" />
              <h1 className="pl-2 text-lg">Order Details</h1>
            </div>
            <Link to="/dashboard-orders">
              <div
                className={`${styles.button} !bg-[#ffd5dd] !rounded-md !text-red-600 !font-[600] !h-[45px] text-lg`}
              >
                Order Lists
              </div>
            </Link>
          </div>
          <div className="w-full flex items-center justify-between pt-6">
            <h5 className="text-gray-600">
              Order ID: <span>{order?._id.slice(0, 8)}</span>
            </h5>
            <h5 className="text-gray-600">
              Placed on: <span>{order.createdAt.slice(0, 10)}</span>
            </h5>
          </div>
          <br />
          <br />
          {order &&
            order.cart.map((data) => (
              <div className="w-full flex items-start mb-5">
                <img
                  src={`${data.images[0]}`}
                  alt=""
                  className="w-[150px] h-[150px]"
                />
                <div className="w-full">
                  <h5 className="pl-3 text-lg">{data.name}</h5>
                  <h5 className="pl-3 text-lg text-gray-500">
                    US${data.discountPrice}x{data.qty}
                  </h5>
                </div>
              </div>
            ))}
          <div className="border-t w-full text-right">
            <h5 className="pt-3 text-lg">
              Total price: <strong>US${order?.totalPrice}</strong>
            </h5>
          </div>
          <br />
          <br />
          <div className="w-full 800px:flex items-center">
            <div className="w-full 800px:w-[60%]">
              <h4 className="pt-3 text-lg font-[600]">Shipping Address</h4>
              <h4 className="pt-3 text-lg text-gray-700">
                {order?.shippingAddress.address1 +
                  " , " +
                  order?.shippingAddress.address2}
              </h4>
              <h4 className="text-lg text-gray-700">
                {order?.shippingAddress.city +
                  ", " +
                  order?.shippingAddress.country}
              </h4>
              <h4 className="text-lg text-gray-700">
                +880{order?.user?.phone}
              </h4>
            </div>
            <div className="w-full 800px:w-[50%] text-end">
              <h4 className="text-lg font-[600]">Payment Information</h4>
              <h4 className="pt-3 text-lg">
                Status: {order?.paymentInfo?.status || "Pending"}
              </h4>
            </div>
          </div>
          <br />
          <br />
          <h4 className="pt-3 text-lg font-[600]">Order Status</h4>
          {order?.status !== "Processing refund" &&
          order?.status !== "Refund success" ? (
            <select
              className="w-[200px] mt-2 border h-[35px] rouned-md"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              {[
                "Processing",
                "Transfered to delivery partner",
                "Shipping",
                "Received",
                "On the way",
                "Delivered",
              ]
                .slice(
                  [
                    "processing",
                    "Transfered to delivery partner",
                    "Shipping",
                    "Received",
                    "On the way",
                    "Delivered",
                  ].indexOf(order?.status)
                )
                .map((option, index) => (
                  <option value={option} key={index}>
                    {option}
                  </option>
                ))}
            </select>
          ) : (
            <select
              className="w-[200px] mt-2 border h-[35px] rouned-md"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              {["Processing refund", "Refund success"]
                .slice(
                  ["Processing refund", "Refund success"].indexOf(order?.status)
                )
                .map((option, index) => (
                  <option value={option} key={index}>
                    {option}
                  </option>
                ))}
            </select>
          )}
          <div
            onClick={
              order?.status === "Processing refund"
                ? () => refundHandler(order._id)
                : ()=>orderUpdateHandler(order._id)
            }
            className={`${styles.button} !bg-[#ffd5dd] !rounded-md !text-red-600 !font-[600] !h-[45px] text-lg`}
          >
            Update status
          </div>
        </>
      )}
    </div>
  );
};

export default OrderDetails;
