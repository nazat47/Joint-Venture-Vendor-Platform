import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import styles from "../../styles/styles";
import { BsFillBagFill } from "react-icons/bs";
import { Link, useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import {
  OrderFailure,
  OrderRequest,
  getAllOrders,
} from "../../redux/reducers/orderSlice";
import Loader from "../layout/Loader";
import { RxCross1 } from "react-icons/rx";
import { AiFillStar, AiOutlineStar } from "react-icons/ai";

const UserOrderDetails = () => {
  const REACT_APP_BASE_URL = process.env.REACT_APP_BASE_URL;
  const { allOrders, loading } = useSelector((state) => state.order);
  const { currentUser } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState(1);
  const [comment, setComment] = useState("");
  const [selectedItem, setSelectedItem] = useState("");
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
        dispatch(OrderFailure(error.message));
        toast.error(error.message);
        console.log(error);
      }
    };
    getAll();
  }, []);
  const order = allOrders?.find((order) => order._id === id);

  const reviewHandler = async () => {
    try {
      const { data } = await axios.post(
        `${REACT_APP_BASE_URL}/product/review`,
        {
          user: currentUser,
          rating,
          message: comment,
          productId: selectedItem?._id,
          userId: currentUser._id,
          orderId: id,
        }
      );
      console.log(data);
      if (data.msg) {
        toast.warn(data.msg);
      } else {
        toast.success(data.message);
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
        setComment("");
        setRating(1);
        setOpen(false);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.msg);
    }
  };
  const refundHandler = async (id) => {
    try {
      const { data } = await axios.patch(
        `${REACT_APP_BASE_URL}/order/refund/${id}`,
        { status: "Processing refund" }
      );
      if (data.msg) {
        toast.error(data.msg);
      } else {
        toast.success("Refund in process");
        navigate("/profile");
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div
      className={`${styles.section} !sm:w-[1200px] my-6 bg-white shadow-md p-8 min-h-screen`}
    >
      {loading ? (
        <Loader />
      ) : (
        <>
          <div className="w-full 800px:w-[60%] flex items-center justify-between">
            <div className="flex items-center">
              <BsFillBagFill size={25} color="crimson" />
              <h1 className="pl-2 text-lg">Order Details</h1>
            </div>
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
                  className="w-[100px] h-[100px]"
                />
                <div className="w-full">
                  <h5 className="pl-3 text-lg">{data.name}</h5>
                  <h5 className="pl-3 text-lg text-gray-500">
                    US${data.discountPrice}x{data.qty}
                  </h5>
                </div>

                {!data.isReviewed && order.status === "Delivered" ? (
                  <div
                    onClick={() => setOpen(true) || setSelectedItem(data)}
                    className={`${styles.button} text-white`}
                  >
                    Write a review
                  </div>
                ) : null}
              </div>
            ))}
          {open && (
            <div className="w-full fixed top-0 left-0 h-screen bg-[#0005] flex items-center justify-center">
              <div className="w-[50%] h-[80vh] bg-white shadow-md rounded-md p-3">
                <div className="w-full flex justify-end">
                  <RxCross1
                    size={20}
                    className="cursor-pointer"
                    onClick={() => setOpen(false)}
                  />
                </div>
                <h2 className="text-[25px] font-[500] text-center">
                  Give a review
                </h2>
                <br />
                <div className="w-full flex mt-6">
                  <img
                    src={`${selectedItem?.images[0]}`}
                    alt="item"
                    className="w-[80px] h-[80px]"
                  />
                  <div>
                    <div className="pl-3 text-lg">{selectedItem?.name}</div>
                    <div className="pl-3 text-lg">
                      US${selectedItem?.discountPrice}x{selectedItem?.qty}
                    </div>
                  </div>
                </div>
                <br />
                <br />
                <h5 className="pl-3 text-lg font-[500]">
                  Give a rating <span className="text-red-500">*</span>
                </h5>
                <div className="flex w-full ml-2 pt-1">
                  {[1, 2, 3, 4, 5].map((i) =>
                    rating >= i ? (
                      <AiFillStar
                        key={i}
                        className="mr-1 cursor-pointer"
                        color="rgb(246,186,0)"
                        size={25}
                        onClick={() => setRating(i)}
                      />
                    ) : (
                      <AiOutlineStar
                        key={i}
                        className="mr-1 cursor-pointer"
                        color="rgb(246,186,0)"
                        size={25}
                        onClick={() => setRating(i)}
                      />
                    )
                  )}
                </div>
                <br />
                <div className="w-full ml-3 mt-3">
                  <label className="block text-lg font-[500]">
                    Write a comment{" "}
                    <span className="font-[400] text-lg text-gray-500">
                      (Optional)
                    </span>
                  </label>
                  <textarea
                    name="comment"
                    id=""
                    cols="20"
                    rows="5"
                    value={comment}
                    placeholder="Write your comment about the product"
                    className="w-[95%] mt-2 border p-2 outline-none"
                    onChange={(e) => setComment(e.target.value)}
                  ></textarea>
                </div>
                <div
                  onClick={reviewHandler}
                  className={`${styles.button} text-white font-lg mt-3 mx-auto`}
                >
                  Submit
                </div>
              </div>
            </div>
          )}
          <div className="border-t w-full text-right">
            <h5 className="pt-3 text-lg">
              Total price: <strong>US${order?.totalPrice}</strong>
            </h5>
          </div>
          <br />
          <br />
          <div className="w-full 800px:flex items-center justify-between">
            <div className="w-full 800px:w-[50%]">
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
              {order?.status === "Delivered" && (
                <div
                  onClick={() => refundHandler(order._id)}
                  className={`${styles.button} text-white ml-auto mt-5`}
                >
                  Give a refund
                </div>
              )}
              <br />
            </div>
          </div>

          <br />
          <Link to="">
            <div className={`${styles.button} text-white`}>Send Message</div>
          </Link>

          <br />
          <br />
        </>
      )}
    </div>
  );
};

export default UserOrderDetails;
