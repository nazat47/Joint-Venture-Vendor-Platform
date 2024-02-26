import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import {
  OrderFailure,
  OrderRequest,
  getAllOrders,
} from "../../redux/reducers/orderSlice";
import { toast } from "react-toastify";
import axios from "axios";

const TrackOrder = () => {
  const REACT_APP_BASE_URL = process.env.REACT_APP_BASE_URL;
  const { allOrders, loading } = useSelector((state) => state.order);
  const { currentUser } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const { id } = useParams();
  useEffect(() => {
    const getAll = async () => {
      try {
        dispatch(OrderRequest());
        const { data } = await axios.get(
          `${REACT_APP_BASE_URL}/order/getAll/${currentUser._id}`
        );
        if (data.msg) {
          toast.error(data.msg);
          dispatch(OrderFailure(data.msg));
        }
        dispatch(getAllOrders(data));
      } catch (error) {
        dispatch(OrderFailure(error.response.data.msg));
        toast.error(error.response.data.msg);
        console.log(error);
      }
    };
    getAll();
  }, []);
  const order = allOrders?.find((order) => order._id === id);
  return (
    <div className="w-full h-[80vh] flex justify-center items-center">
      <>
        {order?.status === "Processing" ? (
          <h1 className="text-lg ">Your order is processing</h1>
        ) : order?.status === "Transfered to delivery partner" ? (
          <h1 className="text-lg ">
            Your order is transfered to our delivery partner
          </h1>
        ) : order?.status === "Shipping" ? (
          <h1 className="text-lg ">
            Your order is shipping to your delivery hub
          </h1>
        ) : order?.status === "Received" ? (
          <h1 className="text-lg ">
            Your order is received at the delivery hub
          </h1>
        ) : order?.status === "On the way" ? (
          <h1 className="text-lg ">Your order is out for delivery</h1>
        ) : order?.status === "Delivered" ? (
          <h1 className="text-lg ">Order delivered</h1>
        ) : order?.status === "Processing refund" ? (
          <h1 className="text-lg ">Refund processing...</h1>
        ) : order?.status === "Refund success" ? (
          <h1 className="text-lg ">Successfully refunded</h1>
        ) : null}
      </>
    </div>
  );
};

export default TrackOrder;
