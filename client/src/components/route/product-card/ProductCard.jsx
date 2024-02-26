import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  AiFillHeart,
  AiOutlineEye,
  AiOutlineHeart,
  AiOutlineShoppingCart,
} from "react-icons/ai";
import styles from "../../../styles/styles";
import { toast } from "react-toastify";
import ProductDetails from "../product-details/ProductDetails";
import {
  addToWishList,
  removeFromWishList,
} from "../../../redux/reducers/wishSlice";
import { addToCart } from "../../../redux/reducers/cartSlice";
import Ratings from "../../products/Ratings";

const ProductCard = ({ product }) => {
  const { wish } = useSelector((state) => state.wish);
  const { cart } = useSelector((state) => state.cart);
  const [click, setClick] = useState(false);
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();
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
  const addToCartHandler = (prod) => {
    const itemExist = cart?.find((item) => item._id === prod._id);
    if (itemExist) {
      toast.error("Item is already added in the cart");
    } else {
      const cartData = { ...product, qty: 1 };
      dispatch(addToCart(cartData));
      localStorage.setItem("cartItems", JSON.stringify(cart));
      toast.success("Item added to cart");
    }
  };
  useEffect(() => {
    if (wish?.find((item) => item._id === product._id)) {
      setClick(true);
    } else {
      setClick(false);
    }
  }, [wish]);
  return (
    <>
      <div className="w-full h-[370px] bg-white rounded-lg shadow-md p-5 relative cursor-pointer mt-12 800px:mt-0">
        <div className="flex justify-end "></div>
        <Link to={`/product/${product._id}`}>
          <img
            src={product.images}
            alt="product"
            className="w-[90%] h-[170px] object-contain"
          ></img>
        </Link>
        <Link to={`/shop/${product.shop._id}`}>
          <h5 className={`${styles.shop_name}`}>Seller: {product.shop.name}</h5>
        </Link>
        <Link to={`/product/${product._id}`}>
          <h4 className="font-semibold">
            {product.name.length > 40
              ? product.name.slice(0, 40) + "..."
              : product.name}
          </h4>
          <div className="flex my-1">
            <Ratings ratings={product?.ratings} />
          </div>
          <div className="py-2 flex items-center justify-between">
            <div className="flex">
              <h5 className={`${styles.productDiscountPrice}`}>
                {product.originalPrice
                  ? product.originalPrice
                  : product.discountPrice}
                $
              </h5>
              <h4 className={`${styles.price}`}>
                {product.discountPrice ? product.discountPrice + "$" : ""}
              </h4>
            </div>
            <span className="font-semibold text-xl text-green-500">
              {product.soldOut ? product.soldOut + " sold" : null}
            </span>
          </div>
        </Link>
        <div>
          {click ? (
            <AiFillHeart
              size={22}
              className="cursor-pointer absolute right-2 top-5"
              onClick={() => removeWishHandler(product)}
              color={click ? "red" : "#333"}
              title="Remove from wishlist"
            />
          ) : (
            <AiOutlineHeart
              size={22}
              className="cursor-pointer absolute right-3 top-5"
              onClick={() => addWishHandler(product)}
              color={click ? "red" : "#333"}
              title="Add to wishlist"
            />
          )}
          <AiOutlineEye
            size={22}
            className="cursor-pointer absolute right-3 top-14"
            onClick={() => setOpen(!open)}
            color="#333"
            title="Quick View"
          />
          <AiOutlineShoppingCart
            size={22}
            className="cursor-pointer absolute right-3 top-24"
            onClick={() => addToCartHandler(product)}
            color="#444"
            title="Add to cart"
          />
          {open && <ProductDetails setOpen={setOpen} product={product} />}
        </div>
      </div>
    </>
  );
};

export default ProductCard;
