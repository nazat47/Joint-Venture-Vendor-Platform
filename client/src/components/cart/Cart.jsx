import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { RxCross1 } from "react-icons/rx";
import { IoBagHandleOutline } from "react-icons/io5";
import styles from "../../styles/styles";
import CartItem from "./CartItem";
import { Link } from "react-router-dom";
import { addToCart, removeFromCart } from "../../redux/reducers/cartSlice";
const Cart = ({ setOpenCart }) => {
  const { cart } = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const removeHandler = (data) => {
    dispatch(removeFromCart(data));
  };
  const totalPrice = cart.reduce(
    (acc, item) => acc + item.discountPrice * item.qty,
    0
  );
  const quantityChange = (data) => {
    dispatch(addToCart(data));
  };
  return (
    <div className=" fixed top-0 left-0 bg-[#0000004b] h-screen w-full z-10">
      <div className="fixed top-0 right-0 shadow-sm min-h-full w-[60%] 800px:w-[30%] bg-white flex flex-col justify-between overflow-y-scroll">
        {cart?.length === 0 ? (
          <div className="w-full h-screen flex items-center justify-center">
            <div className="flex w-full justify-end pt-5 pr-5 fixed top-1 right-1">
              <RxCross1
                size={25}
                className="cursor-pointer"
                onClick={() => setOpenCart(false)}
              />
            </div>
            <h5>Cart is empty!</h5>
          </div>
        ) : (
          <div>
            <div className="flex w-full justify-end pt-5 pr-5">
              <RxCross1
                size={20}
                className="cursor-pointer"
                onClick={() => setOpenCart(false)}
              />
            </div>
            <div className={`${styles.normalFlex} p-4`}>
              <IoBagHandleOutline size={25} />
              <h4 className="pl-2 text-lg font-[500]">{cart.length} items</h4>
            </div>
            <br />
            <div className="w-full border-t">
              {cart.map((item, i) => (
                <CartItem
                  key={i}
                  item={item}
                  quantityChange={quantityChange}
                  removeHandler={removeHandler}
                />
              ))}
            </div>
          </div>
        )}

        <div className="px-5 mb-3">
          <Link to="/checkout">
            <div
              className={`h-[45px] flex items-center justify-center w-[100%] bg-[#e44343] rounded-[5px] p-2`}
            >
              <h1 className="text-white text-md font-[600] font-Roboto">
                Checkout Now (USD ${totalPrice})
              </h1>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Cart;
