import React, { useState } from "react";
import styles from "../../styles/styles";
import { HiOutlineMinus, HiPlus } from "react-icons/hi";
import { RxCross1 } from "react-icons/rx";

const CartItem = ({ item, removeHandler, quantityChange }) => {
  const [value, setValue] = useState(item.qty);
  const totalPrice = item.discountPrice * value;
  const increment = (item) => {
    if (item.stock > value) {
      setValue(value + 1);
      const updateCart = { ...item, qty: value + 1 };
      quantityChange(updateCart);
    }
  };
  const decrement = (item) => {
    if (value > 1) {
      setValue(value - 1);
      const updateCart = { ...item, qty: value - 1 };
      quantityChange(updateCart);
    }
  };
  return (
    <div className="border-b p-4">
      <div className="w-full 800px:flex justify-center 800px:justify-between items-center space-y-3 800px:space-y-0">
        <div className="flex 800px:block space-x-3">
          <div
            onClick={() => increment(item)}
            className={`bg-[#e44343] border border-[#e443473] rounded-full w-[25px] h-[25px] ${styles.normalFlex} justify-center cursor-pointer`}
          >
            <HiPlus size={18} color="white" />
          </div>
          <span className="800px:pl-[10px]">{item.qty}</span>
          <div
            className="bg-[#a7abb14f] rounded-full w-[25px] h-[25px] flex items-center justify-center cursor-pointer"
            onClick={() => decrement(item)}
          >
            <HiOutlineMinus size={16} color="#178796" />
          </div>
        </div>
        <img
          src={item?.images[0]}
          alt="item"
          className="w-[50px] h-[50px] ml-2 mr-2 rounded-sm"
        />
        <div className="pl-[5px]">
          <h1>{item.name}</h1>
          <h4 className="font-[400] text[15px] text-[#00000082]">
            ${item.discountPrice} * {value}
          </h4>
          <h4 className="font-[600] text[17px] text-[#d02222] pt-[3px] font-Roboto">
            US${totalPrice}
          </h4>
        </div>
        <RxCross1
          className="cursor-pointer"
          onClick={() => removeHandler(item)}
        />
      </div>
    </div>
  );
};

export default CartItem;
