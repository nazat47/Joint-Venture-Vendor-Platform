import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
  signInFailure,
  signInStart,
  signOutSuccess,
} from "../../redux/reducers/shopSlice";
import axios from "axios";
import styles from "../../styles/styles";
import { toast } from "react-toastify";
import {
  ProductFailure,
  ProductRequest,
  getShopAllProducts,
} from "../../redux/reducers/productSlice";

const ShopInfo = ({ isOwner }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const REACT_APP_BASE_URL = process.env.REACT_APP_BASE_URL;
  const { shopAllProducts } = useSelector((state) => state.product);
  const { currentShop } = useSelector((state) => state.shop);
  const handleLogout = async () => {
    dispatch(signInStart());
    try {
      const res = await axios.get(`${REACT_APP_BASE_URL}/shop/logout`);
      if (res.data.message) {
        dispatch(signOutSuccess());
        window.location.reload(true);
        navigate("/login-shop");
      }
    } catch (error) {
      dispatch(signInFailure(error.response.data.msg));
    }
  };

  useEffect(() => {
    const getProductAll = async () => {
      try {
        dispatch(ProductRequest());
        const { data } = await axios.get(
          `${REACT_APP_BASE_URL}/product/getAll/${currentShop?._id}`
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
    getProductAll();
  }, []);
  const totalProductReviews = shopAllProducts?.reduce(
    (acc, product) => (acc += product.review.length),
    0
  );
  const totalRatings = shopAllProducts?.reduce(
    (acc, product) =>
      (acc += product.review?.reduce((sum, rev) => (sum += rev.rating), 0)),
    0
  );
  const avgRating = totalRatings / totalProductReviews || 0;
  return (
    <>
      <div className="w-full py-5">
        <div className="w-full flex items-center justify-center">
          <img
            src={currentShop?.avatar}
            alt="logo"
            className="w-[70px] h-[70px] 800px:w-[150px] 800px:h-[150px] rounded-full object-cover"
          />
        </div>
        <h3 className="text-center py-2 text-lg font-Roboto">
          {currentShop.name}
        </h3>
        <p className="text-md text-gray-800 p-[10px] flex items-center">
          {currentShop.description}
        </p>
      </div>
      <div className="p-3">
        <h5 className="font-[600]">Address</h5>
        <h4 className="text-gray-700">{currentShop.address}</h4>
      </div>
      <div className="p-3">
        <h5 className="font-[600]">Phone number:</h5>
        <h4 className="text-gray-700">{currentShop.phone}</h4>
      </div>
      <div className="p-3">
        <h5 className="font-[600]">Total Products</h5>
        <h4 className="text-gray-700">{shopAllProducts?.length}</h4>
      </div>
      <div className="p-3">
        <h5 className="font-[600]">Shop Ratings</h5>
        <h4 className="text-gray-700">{avgRating}/5</h4>
      </div>
      <div className="p-3">
        <h5 className="font-[600]">Joined on</h5>
        <h4 className="text-gray-700">{currentShop.createdAt.slice(0, 10)}</h4>
      </div>
      {isOwner && (
        <div className="py-3 px-4">
          <Link to="/settings">
            <div
              className={`${styles.button} bg-slate-800 !w-full !h-[42px] !rounded-md`}
            >
              <span className="text-white">Edit Shop</span>
            </div>
          </Link>
          <div
            onClick={handleLogout}
            className={`${styles.button} bg-red-600 !w-full !h-[42px] !rounded-md`}
          >
            <span className="text-white">Log Out</span>
          </div>
        </div>
      )}
    </>
  );
};

export default ShopInfo;
