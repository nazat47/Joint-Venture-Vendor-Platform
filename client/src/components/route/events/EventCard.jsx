import React from "react";
import styles from "../../../styles/styles";
import Countdown from "./Countdown";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { addToCart } from "../../../redux/reducers/cartSlice";

const EventCard = ({ active, product }) => {
  const { cart } = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const addToCartHandler = (data) => {
    const itemExist = cart?.find((item) => item._id === data._id);
    if (itemExist) {
      toast.error("Item is already added in the cart");
    } else {
      const cartData = { ...product, qty: 1 };
      dispatch(addToCart(cartData));
      localStorage.setItem("cartItems", JSON.stringify(cart));
      toast.success("Item added to cart");
    }
  };
  return (
    <div
      className={`mt-20 800px:mt-0 w-full block rounded-lg ${
        active ? "unset m-3" : "mb-12"
      } bg-white lg:flex p-2 shadow-md`}
    >
      <div className="w-full lg:w-[50%] m-auto">
        <Link to={`/product/${product?._id}?isEvent=true`}>
          <img src={product.images[0]} alt="item" className="h-[300px] w-[500px]"/>
        </Link>
      </div>
      <div className="w-full lg:w-[50%] flex flex-col justify-center">
        <Link to={`/product/${product?._id}?isEvent=true`}>
          <h2 className={`${styles.productTitle} mb-6`}>{product.name}</h2>
        </Link>
        <p>{product.description}</p>
        <div className="flex py-2 justify-between">
          <div className="flex">
            {product.originalPrice ? (
              <h5 className="font-[500] text-lg text-red-600 pr-3 line-through">
                {product?.originalPrice}$
              </h5>
            ) : (
              ""
            )}
            <h5 className="font-bold text-lg text-[#333] font-Roboto">
              {product?.discountPrice}$
            </h5>
          </div>
          <span className="pr-3 font-semibold text-lg text-[#44a55e]">
            {product.soldOut} sold
          </span>
        </div>
        <Countdown product={product} />
        <br />
        <div className="flex items-center">
          <Link to={`/product/${product._id}?isEvent=true`}>
            <div className={`${styles.button} text-white`}>See details</div>
          </Link>
          <div
            className={`${styles.button} text-white ml-5`}
            onClick={() => addToCartHandler(product)}
          >
            Add to cart
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventCard;
