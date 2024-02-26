import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { BsCartPlus } from "react-icons/bs";
import { RxCross1 } from "react-icons/rx";
import { toast } from "react-toastify";
import { addToCart } from "../../redux/reducers/cartSlice";
import { removeFromWishList } from "../../redux/reducers/wishSlice";

const WishItem = ({ item, removeHandler }) => {
  const { cart } = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const addToCartHandler = (prod) => {
    const itemExist = cart?.find((item) => item._id === prod._id);
    if (itemExist) {
      toast.error("Item is already added in the cart");
    } else {
      const cartData = { ...item, qty: 1 };
      dispatch(addToCart(cartData));
      localStorage.setItem("cartItems", JSON.stringify(cart));
      toast.success("Item added to cart");
      dispatch(removeFromWishList(item));
    }
  };
  return (
    <div className="border-b p-4">
      <div className="w-full 800px:flex items-center justify-center 800px:justify-between space-y-3 800px:space-y-0 800px:space-x-5">
        <RxCross1
          size={20}
          className="cursor-pointer"
          onClick={() => removeHandler(item)}
        />
        <img
          src={item.images[0]}
          alt="item"
          className="w-[60px] h-[60px] ml-2 object-contain"
        />
        <div className="pl-[5px]">
          <h1 className="truncate">{item.name}</h1>
          <h4 className="font-[600] text[17px] text-[#d02222] pt-[3px] font-Roboto">
            US${item.discountPrice}
          </h4>
        </div>
        <div className="">
          <BsCartPlus
            onClick={() => addToCartHandler(item)}
            size={20}
            className="cursor-pointer"
            title="Add to cart"
          />
        </div>
      </div>
    </div>
  );
};

export default WishItem;
