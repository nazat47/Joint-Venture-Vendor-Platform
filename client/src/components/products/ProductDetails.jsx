import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  addToWishList,
  removeFromWishList,
} from "../../redux/reducers/wishSlice";
import { addToCart } from "../../redux/reducers/cartSlice";
import axios from "axios";
import styles from "../../styles/styles";
import {
  AiFillHeart,
  AiOutlineHeart,
  AiOutlineMessage,
  AiOutlineShoppingCart,
} from "react-icons/ai";
import ProductDetailsInfo from "./ProductDetailsInfo";
import {
  ProductFailure,
  ProductRequest,
  getShopAllProducts,
} from "../../redux/reducers/productSlice";
const ProductDetails = ({ product }) => {
  const REACT_APP_BASE_URL = process.env.REACT_APP_BASE_URL;
  const [count, setCount] = useState(1);
  const [click, setClick] = useState(false);
  const [select, setSelect] = useState(0);
  const { cart } = useSelector((state) => state.cart);
  const { currentUser, isAuthenticated } = useSelector((state) => state.user);
  const { wish } = useSelector((state) => state.wish);
  const { shopAllProducts } = useSelector((state) => state.product);
  const navigate = useNavigate();
  const dispatch = useDispatch();
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
  const handleMsgSubmit = async () => {
    try {
      if (isAuthenticated) {
        const groupTitle = currentUser?._id + product?.shop?._id;
        const shopId = product?.shop?._id;
        const userId = currentUser?._id;
        const { data } = await axios.post(
          `${REACT_APP_BASE_URL}/conversation/create`,
          {
            groupTitle,
            shopId,
            userId,
          }
        );
        if (data.msg) {
          toast.error(data.msg);
        } else {
          navigate(`/inbox?id=${data._id}`);
        }
      } else {
        toast.error("Please login to create conversation");
      }
    } catch (error) {
      toast.error(error.response?.data?.msg);
      console.log(error);
    }
  };
  useEffect(() => {
    const getall = async () => {
      try {
        dispatch(ProductRequest());
        const { data } = await axios.get(
          `${REACT_APP_BASE_URL}/product/getAll/${product.shop?._id}`
        );
        if (data.msg) {
          dispatch(ProductFailure(data.msg));
        }
        dispatch(getShopAllProducts(data));
      } catch (error) {
        console.log(error);
        dispatch(ProductFailure(error.response));
      }
    };
    getall();
  }, [product]);
  return (
    <div className="bg-white mt-20">
      {product && (
        <div className={`${styles.section} w-[90%] 800px:w-[80%] `}>
          <div className="w-full py-5">
            <div className="block w-full 800px:flex">
              <div className="w-full 800px:w-[50%] pr-5">
                <img
                  src={`${product.images[select]}`}
                  alt="product"
                  className="w-[350px] h-[350px]"
                />
                <div className="w-full flex space-x-2">
                  {product &&
                    product.images.map((image, i) => (
                      <div
                        className={`${
                          select === i ? "border" : ""
                        } cursor-pointer`}
                        key={i}
                      >
                        <img
                          src={`${image}`}
                          alt="product"
                          className="h-[100px] w-[100px] overflow-hidden mr-3 mt-6 object-stretch"
                          onClick={() => setSelect(i)}
                        />
                      </div>
                    ))}

                  <div
                    className={`${select === 1 ? "border" : ""} cursor-pointer`}
                  ></div>
                </div>
              </div>
              <div className="w-full 800px:w-[50%] pt-5">
                <h1 className={`${styles.productTitle}`}>{product.name}</h1>
                <p style={{ color: "#3d3d3d" }}>{product.description}</p>
                <div className="flex pt-3">
                  <h4 className={`${styles.productDiscountPrice}`}>
                    ${product.discountPrice}
                  </h4>
                  <h3 className={`${styles.price}`}>
                    {product.originalPrice ? product.originalPrice + "$" : ""}
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
                  className={`${styles.button} mt-6 !rounded !h-11 !flex items-center`}
                >
                  <span className="text-white flex items-center">
                    Add to cart <AiOutlineShoppingCart className="ml-1" />
                  </span>
                </div>
                <div className="flex items-center pt-8">
                  <Link to={`/shop/preview/${product.shop?._id}`}>
                    <img
                      src={product.shop?.avatar}
                      alt=""
                      className="w-[50px] h-[50px] rounded-full mr-2"
                    />
                  </Link>
                  <div className="pr-8">
                    <Link to={`/shop/preview/${product.shop._id}`}>
                      <h3 className={`${styles.shop_name} pt-1 pb-1`}>
                        {product.shop?.name}
                      </h3>
                    </Link>
                    <h5 className="pb-3 text-md">
                      {/* ({product.shop.ratings}) ratings */}
                    </h5>
                  </div>
                  <div
                    onClick={handleMsgSubmit}
                    className={`${styles.button} bg-[#5b3cbf] mt-4 !rounded !h-11`}
                  >
                    <span className="text-white flex items-center">
                      Send Message <AiOutlineMessage className="ml-1" />
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <ProductDetailsInfo allProducts={shopAllProducts} product={product} />
          <br />
          <br />
        </div>
      )}
    </div>
  );
};

export default ProductDetails;
