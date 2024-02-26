import React, { useEffect, useState } from "react";
import { RxCross1 } from "react-icons/rx";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import {
  addToWishList,
  removeFromWishList,
} from "../../../redux/reducers/wishSlice";
import styles from "../../../styles/styles";
import {
  AiOutlineMessage,
  AiFillHeart,
  AiOutlineHeart,
  AiOutlineShoppingCart,
} from "react-icons/ai";
import { addToCart } from "../../../redux/reducers/cartSlice";
const ProductDetails = ({ setOpen, product }) => {
  const { cart } = useSelector((state) => state.cart);
  const { wish } = useSelector((state) => state.wish);
  const [count, setCount] = useState(1);
  const [click, setClick] = useState(false);
  const dispatch = useDispatch();
  const handleMsgSubmit = () => {
    console.log("s");
  };
  const decreaseCount = () => {
    if (count > 1) {
      setCount((count) => --count);
    }
  };
  const increaseCount = () => {
    if (product.stock > count) {
      setCount((count) => ++count);
    }
  };
  const addToCartHandler = (id) => {
    const itemExist = cart?.find((item) => item._id === id);
    if (itemExist) {
      toast.error("Item is already added in the cart");
    } else {
      const cartData = { ...product, qty: count };
      dispatch(addToCart(cartData));
      localStorage.setItem("cartItems", JSON.stringify(cart));
      toast.success("Item added to cart");
    }
  };
  const removeWishHandler = (product) => {
    setClick(!click);
    dispatch(removeFromWishList(product));
    localStorage.setItem("wishItems", JSON.stringify(wish));
  };
  const addWishHandler = (product) => {
    setClick(!click);
    dispatch(addToWishList(product));
    localStorage.setItem("wishItems", JSON.stringify(wish));
  };
  useEffect(() => {
    if (wish?.find((item) => item._id === product._id)) {
      setClick(true);
    } else {
      setClick(false);
    }
  }, [wish]);
  return (
    <div className="bg-white">
      {product && (
        <div className="fixed w-full h-screen top-0 left-0 bg-[#00000030] z-40 flex items-center justify-center">
          <div className="w-[90%] 800px:w-[70%] h-[90vh] overflow-y-scroll 800px:h-[75vh] bg-white rounded-md shadow-sm relative p-4">
            <RxCross1
              size={25}
              className="absolute right-3 top-3 z-50"
              onClick={() => setOpen(false)}
            />
            <div className="block w-full 800px:flex">
              <div className="w-full 800px:w-[50%]">
                <img src={product.images} alt="product" />
                <div className="flex">
                  <img
                    src={product.shop.avatar}
                    alt="shop"
                    className="w-[50px] h-[50px] rounded-full m-4"
                  />
                  <div className="">
                    <h3 className={`${styles.shop_name}`}>
                      {product.shop.name}
                    </h3>
                    <h5 className="pb-3 text-[15px]">
                      {" "}
                      ({product.shop.ratings}) Ratings
                    </h5>
                  </div>
                </div>
                <div
                  className={`${styles.button} bg-black mt-4 rounded-sm h-11`}
                  onClick={handleMsgSubmit}
                >
                  <span className="text-white flex items-center">
                    Send Message <AiOutlineMessage className="ml-2" />
                  </span>
                </div>
                <h5 className="text-lg font-semibold text-red-700 mt-5">
                  {product.soldOut} Sold out
                </h5>
              </div>
              <div className="w-full 800px:w-[50%] pt-5 py-[5px]">
                <h1 className={`${styles.productTitle} text-lg mb-5`}>
                  {product.name}
                </h1>
                <p>{product.description}</p>
                <div className="flex pt-3">
                  <h4 className={`${styles.productDiscountPrice}`}>
                    price: {product.discountPrice}$
                  </h4>
                  <h3 className={`${styles.price}`}>
                    {" "}
                    {product.originalPrice ? product.originalPrice + "$" : null}
                  </h3>
                </div>
                <div className="flex items-center mt-12 justify-between pr-3">
                  <div>
                    <button
                      onClick={decreaseCount}
                      className="bg-gradient-to-r from-teal-400 to-teal-500 text-white font-bold rounded-l px-4 py-2 shadow-lg hover:opacity-75 transition duration-300 ease-in-out"
                    >
                      -
                    </button>
                    <span className="bg-gray-200 text-gray-800 font-medium px-4 py-[10px]">
                      {count}
                    </span>
                    <button
                      onClick={increaseCount}
                      className="bg-gradient-to-r from-teal-400 to-teal-500 text-white font-bold rounded-r px-4 py-2 shadow-lg hover:opacity-75 transition duration-300 ease-in-out"
                    >
                      +
                    </button>
                  </div>
                  <div>
                    {click ? (
                      <AiFillHeart
                        size={30}
                        className="cursor-pointer"
                        onClick={() => removeWishHandler(product)}
                        color={click ? "red" : "#333"}
                        title="Remove from wishlist"
                      />
                    ) : (
                      <AiOutlineHeart
                        size={30}
                        className="cursor-pointer"
                        onClick={() => addWishHandler(product)}
                        color={click ? "red" : "#333"}
                        title="Add to wishlist"
                      />
                    )}
                  </div>
                </div>
                <div
                  onClick={() => addToCartHandler(product._id)}
                  className={`${styles.button} mt-6 rounded-sm h-11 flex items-center`}
                >
                  <span className="text-white flex items-center">
                    Add to cart <AiOutlineShoppingCart className="ml-1" />
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetails;
