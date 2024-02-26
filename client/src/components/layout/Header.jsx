import React, { useEffect, useState } from "react";
import styles from "../../styles/styles";
import { Link } from "react-router-dom";
import { categoriesData } from "../../static/data";
import {
  AiOutlineHeart,
  AiOutlineSearch,
  AiOutlineShoppingCart,
} from "react-icons/ai";
import { IoIosArrowDown, IoIosArrowForward } from "react-icons/io";
import { BiMenuAltLeft } from "react-icons/bi";
import { CgProfile } from "react-icons/cg";
import { useSelector } from "react-redux";
import DropDown from "./DropDown";
import Navbar from "./Navbar";
import Cart from "../cart/Cart";
import Wishlist from "../wishlist/Wishlist";
import { RxCross1 } from "react-icons/rx";

const Header = ({ activeHeading }) => {
  const { currentUser, isAuthenticated } = useSelector((state) => state.user);
  const { cart } = useSelector((state) => state.cart);
  const { wish } = useSelector((state) => state.wish);
  const { currentShop } = useSelector((state) => state.shop);
  const { allProducts } = useSelector((state) => state.product);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchData, setSearchData] = useState(null);
  const [active, setActive] = useState(false);
  const [dropdown, setDropDown] = useState(false);
  const [openCart, setOpenCart] = useState(false);
  const [openWishList, setOpenWishList] = useState(false);
  const [open, setOpen] = useState(false);
  const handleSearch = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    const filteredProducts =
      allProducts &&
      allProducts?.filter((product) =>
        product.name.toLowerCase().includes(term.toLowerCase())
      );
    setSearchData(filteredProducts);
  };
  window.addEventListener("scroll", () => {
    if (window.scrollY > 70) {
      setActive(true);
    } else {
      setActive(false);
    }
  });
  useEffect(() => {
    if (searchTerm === "") {
      setSearchData("");
    }
  }, [searchTerm]);

  return (
    <>
      <div className={`${styles.section}`}>
        <div className="hidden 800px:h-[50px] 800px:flex items-center justify-between my-10">
          <div className="h-[100px] w-[200px] rounded-md">
            <Link to="/">
              <img
                src="https://png.pngtree.com/png-vector/20190322/ourmid/pngtree-shop-logo-vector-template-design-illustration-png-image_860073.jpg"
                alt="logo"
                className="h-full w-full object-stretch rounded-3xl"
              />
            </Link>
          </div>
          <div className="w-[50%] relative">
            <input
              type="text"
              placeholder="Search"
              value={searchTerm}
              onChange={handleSearch}
              className="h-[40px] w-full px-2 border-slate-400 border-[1px] rounded-md text-slate-600 font-semibold"
            />
            <AiOutlineSearch
              size={25}
              className="absolute right-2 top-1.5 cursor-pointer"
            />
            {searchData && searchData.length > 0 ? (
              <div className="absolute min-h-[30vh] bg-slate-50 shadow-md z-[9] p-4">
                {searchData?.map((item, i) => {
                  return (
                    <Link to={`/product/${item._id}`}>
                      <div className="w-full flex items-start py-3">
                        <img
                          src={item.images[0]}
                          alt="items"
                          className="w-[40px] h-[40px] mr-[10px]"
                        ></img>
                        <h1>{item.name}</h1>
                      </div>
                    </Link>
                  );
                })}
              </div>
            ) : null}
          </div>

          <div className={`${styles.button} p-2`}>
            {currentShop === null ? (
              <Link to="/create-shop">
                <h1 className="text-white text-sm flex items-center">
                  Become a Seller <IoIosArrowForward className="ml-1" />
                </h1>
              </Link>
            ) : (
              <Link to="/dashboard">
                <h1 className="text-white text-sm flex items-center">
                  Go to shop dashboard <IoIosArrowForward className="ml-1" />
                </h1>
              </Link>
            )}
          </div>
        </div>
      </div>
      <div
        className={`${
          active ? "shadow-sm fixed top-0 left-0 z-10" : null
        } transition hidden 800px:flex items-center justify-between w-full bg-slate-800 h-[70px]`}
      >
        <div
          className={`${styles.section} relative ${styles.normalFlex} justify-between`}
        >
          <div>
            <div className="relative h-[60px] mt-[15px] w-[270px] hidden 1000px:block">
              <BiMenuAltLeft size={30} className="absolute top-4 left-4" />
              <button
                className={`h-full w-full flex justify-between items-center pl-16 bg-white font-sans text-lg font-[500] select-none rounded-md`}
              >
                All Categories
              </button>
              <IoIosArrowDown
                onClick={() => setDropDown(!dropdown)}
                size={20}
                className="absolute right-4 top-5 cursor-pointer"
              />
              {dropdown && (
                <DropDown
                  categoriesData={categoriesData}
                  setDropDown={setDropDown}
                />
              )}
            </div>
          </div>
          <div className={`${styles.normalFlex}`}>
            <Navbar active={activeHeading} />
          </div>
          <div className="flex space-x-2">
            <div className={`${styles.normalFlex}`}>
              <div
                onClick={() => setOpenWishList(true)}
                className="relative cursor-pointer mr-[15px]"
              >
                <AiOutlineHeart size={30} color="rgb(255 255 255 / 83%)" />
                <span className="absolute top-0 right-0 rounded-full bg-blue-400 w-4 h-4 p-0 m-0 text-white font-mono text-sm leading-tight text-center">
                  {wish?.length}
                </span>
              </div>
            </div>
            <div className={`${styles.normalFlex}`}>
              <div
                onClick={() => setOpenCart(true)}
                className="relative cursor-pointer mr-[15px]"
              >
                <AiOutlineShoppingCart
                  size={30}
                  color="rgb(255 255 255 / 83%)"
                />
                <span className="absolute top-0 right-0 rounded-full bg-blue-400 w-4 h-4 p-0 m-0 text-white font-mono text-sm leading-tight text-center">
                  {cart?.length}
                </span>
              </div>
            </div>
            <div className={`${styles.normalFlex}`}>
              <div className="relative cursor-pointer mr-[15px]">
                {currentUser ? (
                  <Link to="/profile">
                    <img
                      src={currentUser?.avatar}
                      className="w-[35px] h-[35px] rounded-full"
                      alt="user"
                    />
                  </Link>
                ) : (
                  <Link to="/login">
                    <CgProfile size={30} color="rgb(255 255 255 / 83%)" />
                  </Link>
                )}
              </div>
            </div>
            {openCart && <Cart setOpenCart={setOpenCart} />}
            {openWishList && <Wishlist setOpenWishList={setOpenWishList} />}
          </div>
        </div>
      </div>
      <div className="w-full h-[70px] fixed bg-white z-50 top-0 left-0 shadow-md 800px:hidden">
        <div className="w-full flex items-center justify-between">
          <div>
            <BiMenuAltLeft
              size={40}
              className="ml-4"
              onClick={() => setOpen(true)}
            />
          </div>
          <div className="h-[70px] w-[150px] rounded-md">
            <Link to="/">
              <img
                src="https://png.pngtree.com/png-vector/20190322/ourmid/pngtree-shop-logo-vector-template-design-illustration-png-image_860073.jpg"
                alt="logo"
                className="h-full w-full cursor-pointer object-stretch rounded-xl"
              />
            </Link>
          </div>
          <div>
            <div
              className="relative mr-[20px]"
              onClick={() => setOpenCart(true)}
            >
              <AiOutlineShoppingCart size={30} />
              <span className="absolute top-0 right-0 rounded-full bg-blue-400 w-4 h-4 p-0 m-0 text-white font-mono text-sm leading-tight text-center cursor-pointer">
                {cart.length}
              </span>
            </div>
            {openCart && <Cart setOpenCart={setOpenCart} />}
            {openWishList && <Wishlist setOpenWishList={setOpenWishList} />}
          </div>
        </div>
        {open && (
          <div className="fixed w-full bg-[#0000005f] z-20 h-full top-0 left-0">
            <div className="fixed w-[60%] bg-white h-screen top-0 left-0 z-10 overflow-y-scroll">
              <div className="w-full flex justify-between pr-3">
                <div>
                  <div
                    className="relative mr-[15px] ml-2 mt-2 cursor-pointer"
                    onClick={() => setOpenWishList(true) || setOpen(false)}
                  >
                    <AiOutlineHeart size={30} />
                    <span className="absolute top-0 right-0 rounded-full bg-blue-400 w-4 h-4 p-0 m-0 text-white font-mono text-sm leading-tight text-center">
                      {wish.length}
                    </span>
                  </div>
                </div>
                <RxCross1
                  size={25}
                  className="ml-4 mt-2 cursor-pointer"
                  onClick={() => setOpen(false)}
                />
              </div>
              <div className="my-8 w-[92%] m-auto h-[40px]">
                <input
                  type="search"
                  placeholder="Search products..."
                  className="h-[40px] w-full px-2 border-slate-400 border-[2px] rounded-md"
                  value={searchTerm}
                  onChange={handleSearch}
                />
                {searchData && (
                  <div className="absolute max-h-screen bg-slate-50 shadow-md z-[9] p-4 w-full left-0">
                    {searchData && searchData.length > 0 ? (
                      <div className="absolute min-h-[30vh] bg-slate-50 shadow-md z-[9] p-4">
                        {searchData?.map((item, i) => {
                          return (
                            <Link to={`/product/${item._id}`}>
                              <div className="w-full flex items-start py-3">
                                <img
                                  src={item.images[0]}
                                  alt="items"
                                  className="w-[40px] h-[40px] mr-[10px]"
                                ></img>
                                <h1>{item.name}</h1>
                              </div>
                            </Link>
                          );
                        })}
                      </div>
                    ) : null}
                  </div>
                )}
              </div>
              <Navbar active={activeHeading} />
              <div className={`${styles.button} ml-4 !rounded-[4px] `}>
                <Link to="/create-shop">
                  <h1 className="text-white flex items-center">
                    Become a Seller <IoIosArrowForward className="ml-1" />
                  </h1>
                </Link>
              </div>
              <br />
              <br />
              <br />
              <div className="flex w-full justify-center space-x-4">
                {!isAuthenticated ? (
                  <>
                    <Link
                      to="/login"
                      className="text-lg pr-[8px] text-gray-800 hover:underline"
                    >
                      Login
                    </Link>
                    |
                    <Link
                      to="/sign-up"
                      className="text-lg pr-[8px] text-gray-800 hover:underline"
                    >
                      Sign up
                    </Link>
                  </>
                ) : (
                  <div>
                    <Link to="/profile">
                      <img
                        src={currentUser.avatar}
                        className="w-[70px] h-[70px] rounded-full border-[2px] border-slate-600"
                        alt="user"
                      />
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Header;
