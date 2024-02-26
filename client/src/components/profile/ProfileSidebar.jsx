import React from "react";
import { AiOutlineLogin, AiOutlineMessage } from "react-icons/ai";
import { RiLockPasswordLine } from "react-icons/ri";
import { HiOutlineShoppingBag, HiReceiptRefund } from "react-icons/hi";
import { RxPerson } from "react-icons/rx";
import { TbAddressBook } from "react-icons/tb";
import {
  MdOutlineAdminPanelSettings,
  MdOutlineTrackChanges,
} from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  signInFailure,
  signInStart,
  signOutSuccess,
} from "../../redux/reducers/userSlice";
import axios from "axios";

const ProfileSidebar = ({ active, setActive }) => {
  const REACT_APP_BASE_URL = process.env.REACT_APP_BASE_URL;
  const { currentUser } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const logoutHandler = async () => {
    dispatch(signInStart());
    try {
      const res = await axios.get(`${REACT_APP_BASE_URL}/users/logout`);
      if (res.data.message) {
        dispatch(signOutSuccess());
        window.location.reload(true);
        navigate("/login");
      }
    } catch (error) {
      dispatch(signInFailure(error.response.data.msg));
    }
  };
  return (
    <div className="w-full bg-white shadow-md font-[500] font-Roboto rounded-md p-4 pt-8">
      <div
        onClick={() => setActive(1)}
        className="flex items-center cursor-pointer w-full mb-8  hover:text-red-500"
      >
        <RxPerson size={20} color={active === 1 ? "red" : ""} />
        <span
          className={`pl-3 ${
            active === 1 ? "text-red-500" : ""
          } 800px:block hidden`}
        >
          Profile
        </span>
      </div>
      <div
        onClick={() => setActive(2)}
        className="flex items-center cursor-pointer w-full mb-8 hover:text-red-500"
      >
        <HiOutlineShoppingBag size={20} color={active === 2 ? "red" : ""} />
        <span
          className={`pl-3 ${
            active === 2 ? "text-red-700" : ""
          } 800px:block hidden`}
        >
          Orders
        </span>
      </div>
      <div
        onClick={() => setActive(3)}
        className="flex items-center cursor-pointer w-full mb-8 hover:text-red-500"
      >
        <HiReceiptRefund size={20} color={active === 3 ? "red" : ""} />
        <span
          className={`pl-3 ${
            active === 3 ? "text-red-700" : ""
          } 800px:block hidden`}
        >
          Refunds
        </span>
      </div>
      <div
        onClick={() => setActive(4) || navigate("/inbox")}
        className="flex items-center cursor-pointer w-full mb-8 hover:text-red-500"
      >
        <AiOutlineMessage size={20} color={active === 4 ? "red" : ""} />
        <span
          className={`pl-3 ${
            active === 4 ? "text-red-700" : ""
          } 800px:block hidden`}
        >
          Inbox
        </span>
      </div>
      <div
        onClick={() => setActive(5)}
        className="flex items-center cursor-pointer w-full mb-8 hover:text-red-500"
      >
        <MdOutlineTrackChanges size={20} color={active === 5 ? "red" : ""} />
        <span
          className={`pl-3 ${
            active === 5 ? "text-red-700" : ""
          } 800px:block hidden`}
        >
          Track
        </span>
      </div>
      <div
        onClick={() => setActive(6)}
        className="flex items-center cursor-pointer w-full mb-8 hover:text-red-500"
      >
        <RiLockPasswordLine size={20} color={active === 6 ? "red" : ""} />
        <span
          className={`pl-3 ${
            active === 6 ? "text-red-700" : ""
          } 800px:block hidden`}
        >
          Change password
        </span>
      </div>
      <div
        onClick={() => setActive(7)}
        className="flex items-center cursor-pointer w-full mb-8 hover:text-red-500"
      >
        <TbAddressBook size={20} color={active === 7 ? "red" : ""} />
        <span
          className={`pl-3 ${
            active === 7 ? "text-red-700" : ""
          } 800px:block hidden`}
        >
          Address
        </span>
      </div>
      {currentUser?.role === "admin" && (
        <Link to="/admin/dashboard">
          <div
            onClick={() => setActive(8)}
            className="flex items-center cursor-pointer w-full mb-8 hover:text-red-500"
          >
            <MdOutlineAdminPanelSettings
              size={20}
              color={active === 8 ? "red" : ""}
            />
            <span
              className={`pl-3 ${
                active === 8 ? "text-red-700" : ""
              } 800px:block hidden`}
            >
              Admin Dashboard
            </span>
          </div>
        </Link>
      )}
      <div
        onClick={() => setActive(9) || logoutHandler()}
        className="flex items-center cursor-pointer w-full mb-8 hover:text-red-500"
      >
        <AiOutlineLogin size={20} color={active === 9 ? "red" : ""} />
        <span
          className={`pl-3 ${
            active === 9 ? "text-red-700" : ""
          } 800px:block hidden`}
        >
          Log out
        </span>
      </div>
    </div>
  );
};

export default ProfileSidebar;
