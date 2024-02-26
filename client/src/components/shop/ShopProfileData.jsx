import React, { useEffect, useState } from "react";
import ProductCard from "../route/product-card/ProductCard";
import { Link } from "react-router-dom";
import styles from "../../styles/styles";
import { useSelector, useDispatch } from "react-redux";
import Ratings from "../products/Ratings";
import {
  ProductFailure,
  ProductRequest,
  getShopAllProducts,
} from "../../redux/reducers/productSlice";
import {
  EventFailure,
  EventRequest,
  getShopAllEvents,
} from "../../redux/reducers/eventSlice";
import { toast } from "react-toastify";
import axios from "axios";
import EventCard from "../route/events/EventCard";

const ShopProfileData = ({ isOwner }) => {
  const REACT_APP_BASE_URL = process.env.REACT_APP_BASE_URL;
  const [active, setActive] = useState(1);
  const { shopAllProducts } = useSelector((state) => state.product);
  const { shopAllEvents } = useSelector((state) => state.event);
  const { currentShop } = useSelector((state) => state.shop);
  const dispatch = useDispatch();

  useEffect(() => {
    const getEventAll = async () => {
      try {
        dispatch(EventRequest());
        const { data } = await axios.get(
          `${REACT_APP_BASE_URL}/event/getAll/${currentShop._id}`
        );
        // if (data?.msg) {
        //   dispatch(EventFailure(data?.msg));
        //   toast.error(data?.msg);
        // }
        dispatch(getShopAllEvents(data));
      } catch (error) {
        dispatch(EventFailure(error.message));
        // toast.error(error.response.data?.msg);
        console.log(error)
      }
    };
    const getProductAll = async () => {
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
    getEventAll();
    getProductAll();
  }, []);
  const allReviews = shopAllProducts?.map((product) => product.review).flat();
  return (
    <div className="w-full">
      <div className="w-full flex items-center ">
        <div className="w-full flex">
          <div onClick={() => setActive(1)} className="flex items-center">
            <h5
              className={`${
                active === 1 ? "text-red-500" : "text-gray-700"
              } font-[600] text-lg cursor-pointer pr-5`}
            >
              Shop Products
            </h5>
          </div>
          <div onClick={() => setActive(2)} className="flex items-center">
            <h5
              className={`${
                active === 2 ? "text-red-500" : "text-gray-700"
              } font-[600] text-lg cursor-pointer pr-5`}
            >
              Running Events
            </h5>
          </div>
          <div onClick={() => setActive(3)} className="flex items-center">
            <h5
              className={`${
                active === 3 ? "text-red-500" : "text-gray-700"
              } font-[600] text-lg cursor-pointer pr-5`}
            >
              Shop Reviews
            </h5>
          </div>
        </div>
        <div>
          {isOwner && (
            <div>
              <Link to="/dashboard">
                <div className={`${styles.button} !rounded-[4px] h-[42px]`}>
                  <span className="text-white">Go to Dashboard</span>
                </div>
              </Link>
            </div>
          )}
        </div>
      </div>
      <br />
      {active === 1 && (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 md:gap-6 lg:grid-cols-3 lg:gap-6 xl:grid-cols-4 xl:gap-8 mb-12">
          {shopAllProducts?.map((data, i) => (
            <ProductCard product={data} key={i} isShop={true} />
          ))}
        </div>
      )}
      {active === 2 && (
        <div className="w-full">
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 md:gap-6 lg:grid-cols-3 lg:gap-6 xl:grid-cols-4 xl:gap-8 mb-12">
            {shopAllEvents?.map((data, i) => (
              <EventCard product={data} key={i} isShop={true} />
            ))}
          </div>
        </div>
      )}
      {active === 3 && (
        <div className="w-full">
          {allReviews?.map((data, i) => (
            <div className="w-full flex my-4">
              <img
                src={data.user.avatar}
                alt="user"
                className="h-[50px] w-[50px] rounded-full"
              />
              <div className="pl-2">
                <div className="flex items-center w-full">
                  <h1 className="font-[600] pr-2">{data.user.username}</h1>
                  <Ratings ratings={data.rating} />
                </div>
                <p className="font-[400] text-gray-600">{data.message}</p>
                <p className="font-[400] text-gray-500 text-sm">
                  {data.createdAt || "2 days ago"}
                </p>
              </div>
            </div>
          ))}
         
        </div>
      )}
    </div>
  );
};

export default ShopProfileData;
