import React from "react";
import { RxCross1 } from "react-icons/rx";
import { useSelector, useDispatch } from "react-redux";
import styles from "../../styles/styles";
import { Link } from "react-router-dom";
import WishItem from "./WishItem";
import { AiOutlineHeart } from "react-icons/ai";
import { removeFromWishList } from "../../redux/reducers/wishSlice";

const Wishlist = ({ setOpenWishList }) => {
  const { wish } = useSelector((state) => state.wish);
  const dispatch = useDispatch();

  const removeHandler = (data) => {
    dispatch(removeFromWishList(data));
    localStorage.setItem("wishItems", JSON.stringify(wish));
  };
  return (
    <div className="fixed top-0 left-0 bg-[#0000004b] h-screen w-full z-10">
      <div className="fixed top-0 right-0 shadow-sm min-h-full w-[60%] 800px:w-[30%] bg-white flex flex-col justify-between">
        <div>
          <div className="flex w-full justify-end pt-5 pr-5">
            <RxCross1
              size={20}
              className="cursor-pointer"
              onClick={() => setOpenWishList(false)}
            />
          </div>
          <div className={`${styles.normalFlex} p-4`}>
            <AiOutlineHeart size={25} />
            <h4 className="pl-2 text-lg font-[500]">{wish.length}</h4>
          </div>
          <br />
          {wish?.length === 0 ? (
            <div className="w-full h-screen flex items-center justify-center">
              <h5>Wishlist is empty!</h5>
            </div>
          ) : (
            <div className="w-full border-t">
              {wish.map((item, i) => (
                <WishItem key={i} item={item} removeHandler={removeHandler} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Wishlist;
