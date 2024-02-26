import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  OrderFailure,
  OrderRequest,
  getShopAllOrders,
} from "../../redux/reducers/orderSlice";
import axios from "axios";
import { toast } from "react-toastify";
import styles from "../../styles/styles";
import { RxCross1 } from "react-icons/rx";
import { signInSuccess } from "../../redux/reducers/shopSlice";
import { AiOutlineDelete } from "react-icons/ai";
const ShopWithdraw = () => {
  const REACT_APP_BASE_URL = process.env.REACT_APP_BASE_URL;
  const dispatch = useDispatch();
  const { shopAllOrders } = useSelector((state) => state.order);
  const { currentShop } = useSelector((state) => state.shop);
  const [deliveredOrder, setDeliveredOrder] = useState(null);
  const [open, setOpen] = useState(false);
  const [addNew, setAddNew] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState(false);
  const [bankInfo, setBankInfo] = useState({
    bankName: "",
    bankAddress: "",
    swiftCode: null,
    accNumber: null,
    holderName: "",
    country: "",
  });
  const handleChange = (e) => {
    setBankInfo((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };
  useEffect(() => {
    const getShopAll = async () => {
      try {
        dispatch(OrderRequest());
        const { data } = await axios.get(
          `${REACT_APP_BASE_URL}/order/getShopAll/${currentShop._id}`
        );
        if (data.msg) {
          dispatch(OrderFailure(data.msg));
          toast.error(data.msg);
        }
        dispatch(getShopAllOrders(data));
      } catch (error) {
        dispatch(OrderFailure(error.response));
        toast.error(error.response);
      }
    };

    const getShop = async () => {
      try {
        const { data } = await axios.get(
          `${REACT_APP_BASE_URL}/shop/get/${currentShop._id}`
        );
        dispatch(signInSuccess(data));
      } catch (error) {
        console.log(error.response);
      }
    };
    getShop();
    getShopAll();

    const orderData = shopAllOrders?.filter(
      (order) => order.status === "Delivered"
    );
    setDeliveredOrder(orderData);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.patch(
        `${REACT_APP_BASE_URL}/shop/update-withdraw/${currentShop._id}`,
        bankInfo
      );
      if (data.msg) {
        toast.error(data.msg);
      }
      toast.success("Withdraw method added");
      setBankInfo({
        bankName: "",
        bankAddress: "",
        swiftCode: null,
        accNumber: null,
        holderName: "",
        country: "",
      });
      setAddNew(false);
      try {
        const { data } = await axios.get(
          `${REACT_APP_BASE_URL}/shop/get/${currentShop._id}`
        );
        dispatch(signInSuccess(data));
      } catch (error) {
        console.log(error.response);
      }
    } catch (error) {
      toast.error(error.response);
    }
  };
  const deleteHandler = async () => {
    const { data } = await axios.patch(
      `${REACT_APP_BASE_URL}/shop/delete-withdraw/${currentShop?._id}`
    );
    if (data.msg) {
      toast.error(data.msg);
    } else {
      toast.success("Deleted withdraw method");
    }
    try {
      const { data } = await axios.get(
        `${REACT_APP_BASE_URL}/shop/get/${currentShop._id}`
      );
      dispatch(signInSuccess(data));
    } catch (error) {
      console.log(error.response);
    }
  };
  const handleWithdraw = async (e) => {
    if (withdrawAmount > currentShop?.availableBalance || withdrawAmount <= 0) {
      toast.error("please enter correct withdraw amount");
    } else {
      try {
        const { data } = await axios.post(
          `${REACT_APP_BASE_URL}/withdraw/create`,
          {
            id: currentShop._id,
            amount: withdrawAmount,
          }
        );
        if (data.msg) {
          toast.error(data.msg);
        }
        toast.success("Withdraw request processing");
        try {
          const { data } = await axios.get(
            `${REACT_APP_BASE_URL}/shop/get/${currentShop._id}`
          );
          dispatch(signInSuccess(data));
        } catch (error) {
          console.log(error.response);
        }
        setOpen(false);
      } catch (error) {
        console.log(error.response);
      }
    }
  };
  return (
    <div className="w-full h-[90vh] p-[32px]">
      <div className="w-full bg-white h-full rounded shadow-sm flex items-center justify-center flex-col">
        <h5 className="text-lg pb-4">
          Available balance: ${currentShop?.availableBalance}
        </h5>
        <div
          onClick={() =>
            currentShop?.availableBalance > 0
              ? setOpen(true)
              : toast.error("Not enough balance")
          }
          className={`${styles.button} text-white !h-[42px]`}
        >
          Withdraw
        </div>
      </div>
      {open && (
        <div className="w-full h-screen fixed top-0 left-0 flex items-center justify-center bg-[#0000004e] z-[999]">
          <div
            className={`w-[90%] 800px:w-[50%] ${
              addNew ? "h-[80vh] overflow-y-scroll" : "h-[unset]"
            } min-h-[40vh] shadow rounded bg-white p-2`}
          >
            <div className="w-full flex justify-end ">
              <RxCross1
                size={20}
                onClick={() => setOpen(false) || setAddNew(false)}
                className="cursor-pointer "
              />
            </div>
            {addNew ? (
              <div className="">
                <h3 className="text-xl text-center font-semibold">
                  Add new withdraw methods:
                </h3>
                <form onSubmit={handleSubmit}>
                  <div className="m-3 my-6">
                    <label>
                      Bank Name <span className="text-red-700">*</span>
                    </label>
                    <input
                      type="text"
                      name="bankName"
                      placeholder="Enter your bank name"
                      className={`${styles.input} mt-2`}
                      onChange={(e) => handleChange(e)}
                      required
                    />
                  </div>
                  <div className="m-3 my-6">
                    <label>
                      Country <span className="text-red-700">*</span>
                    </label>
                    <input
                      type="text"
                      name="country"
                      placeholder="Enter bank country name"
                      className={`${styles.input} mt-2`}
                      onChange={(e) => handleChange(e)}
                      required
                    />
                  </div>
                  <div className="m-3 my-6">
                    <label>
                      Account Number <span className="text-red-700">*</span>
                    </label>
                    <input
                      type="number"
                      name="accNumber"
                      placeholder="Enter your account number"
                      className={`${styles.input} mt-2`}
                      onChange={(e) => handleChange(e)}
                      required
                    />
                  </div>
                  <div className="m-3 my-6">
                    <label>
                      Bank Swift Code <span className="text-red-700">*</span>
                    </label>
                    <input
                      type="number"
                      name="swiftCode"
                      placeholder="Enter swift code"
                      className={`${styles.input} mt-2`}
                      onChange={(e) => handleChange(e)}
                      required
                    />
                  </div>
                  <div className="m-3 my-6">
                    <label>
                      Account Holder Name
                      <span className="text-red-700">*</span>
                    </label>
                    <input
                      type="text"
                      name="holderName"
                      placeholder="Enter account holder name"
                      className={`${styles.input} mt-2`}
                      onChange={(e) => handleChange(e)}
                      required
                    />
                  </div>
                  <div className="m-3 my-6">
                    <label>
                      Address <span className="text-red-700">*</span>
                    </label>
                    <input
                      type="text"
                      name="bankAddress"
                      placeholder="Enter bank address"
                      className={`${styles.input} mt-2`}
                      onChange={(e) => handleChange(e)}
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className={`${styles.button} text-white mx-auto transition-all ease hover:!w-40 `}
                  >
                    Add
                  </button>
                </form>
              </div>
            ) : (
              <>
                <h3 className="text-xl pl-3">Available withdraw methods:</h3>
                {currentShop?.withdrawMethod ||
                currentShop?.withdrawMethod !== null ? (
                  <div className="ml-3 mt-4">
                    <div className="flex w-full justify-between">
                      <div>
                        <h5>
                          Account Number:{" "}
                          {"*".repeat(
                            currentShop?.withdrawMethod?.accNumber.length - 3
                          ) + currentShop?.withdrawMethod?.accNumber.slice(-3)}
                        </h5>
                        <h5>
                          Bank Name: {currentShop?.withdrawMethod?.bankName}
                        </h5>
                      </div>
                      <div>
                        <AiOutlineDelete
                          size={25}
                          className="cursor-pointer hover:text-red-600"
                          onClick={deleteHandler}
                        />
                      </div>
                    </div>
                    <br />
                    <h4>Available balance: {currentShop?.availableBalance}$</h4>
                    <br />
                    <div className="w-full 800px:flex items-center space-x-4">
                      <input
                        type="number"
                        value={withdrawAmount}
                        onChange={(e) => setWithdrawAmount(e.target.value)}
                        placeholder="Withdraw amuont..."
                        className={`${styles.input} 800px:w-[50%]`}
                      />
                      <div
                        onClick={handleWithdraw}
                        className={`${styles.button} text-white !h-[45px]`}
                      >
                        Withdraw
                      </div>
                    </div>
                  </div>
                ) : (
                  <>
                    <p className="text-lg pt-8 text-gray-700">
                      No withdraw methods saved!
                    </p>
                    <div className="w-full flex items-center justify-center">
                      <div
                        onClick={() => setAddNew(true)}
                        className={`${styles.button} text-white text-lg mt-28`}
                      >
                        Add new
                      </div>
                    </div>
                  </>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ShopWithdraw;
