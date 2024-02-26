import React, { useEffect, useState } from "react";
import {
  AiOutlineArrowRight,
  AiOutlineCamera,
  AiOutlineDelete,
} from "react-icons/ai";
import { useSelector, useDispatch } from "react-redux";
import styles from "../../styles/styles";
import { Link } from "react-router-dom";
import { Button } from "@material-ui/core";
import { DataGrid } from "@material-ui/data-grid";
import { MdTrackChanges } from "react-icons/md";
import { RxCross1 } from "react-icons/rx";
import { Country, State } from "country-state-city";
import { app } from "../../firebase";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import axios from "axios";
import {
  deleteUserAddressSuccess,
  updateAddressFailure,
  updateAddressStart,
  updateFailure,
  updateStart,
  updateSuccess,
} from "../../redux/reducers/userSlice";
import { toast } from "react-toastify";
import {
  OrderFailure,
  OrderRequest,
  getAllOrders,
} from "../../redux/reducers/orderSlice";

const ProfileContent = ({ active }) => {
  const REACT_APP_BASE_URL = process.env.REACT_APP_BASE_URL;
  const { currentUser } = useSelector((state) => state.user);
  const [name, setName] = useState(currentUser?.username);
  const [email, setEmail] = useState(currentUser?.email);
  const [number, setNumber] = useState(currentUser?.phone);
  const [avatar, setAvatar] = useState(currentUser?.avatar);
  const dispatch = useDispatch();
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(updateStart());
      const { data } = await axios.patch(`${REACT_APP_BASE_URL}/users/update`, {
        username: name,
        email,
        phone: number,
      });
      if (data.msg) {
        toast.error(data.msg);
        dispatch(updateFailure(data.msg));
      }
      dispatch(updateSuccess(data));
      toast.success("user updated");
    } catch (error) {
      toast.error(error.response.data.msg);
      console.log(error);
    }
  };
  const handleChange = async (e) => {
    const file = e.target.files[0];
    const promise = storeFile(file);
    promise
      .then(async (url) => {
        setAvatar(url);
        console.log(avatar);
        try {
          const { data } = await axios.patch(
            `${REACT_APP_BASE_URL}/users/update/avatar`,
            { avatar: url, id: currentUser?._id }
          );
          console.log(data);
          if (data.msg) {
            toast.error(data.msg);
          }
          dispatch(updateSuccess(data));
          setAvatar("");
        } catch (error) {
          console.log(error);
        }
      })
      .catch((err) => {
        console.log(err.message);
      });
  };
  const storeFile = async (file) => {
    return new Promise((resolve, reject) => {
      const storage = getStorage(app);
      const filename = new Date().getTime() + file.name;
      const storageRef = ref(storage, filename);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(`Uploading ${progress}%`);
        },
        (error) => {
          reject(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadUrl) => {
            resolve(downloadUrl);
          });
        }
      );
    });
  };
  return (
    <div className="w-full mt-20 800px:mt-0">
      {active === 1 && (
        <>
          <div className="flex justify-center w-full">
            <div className="relative">
              <img
                src={currentUser?.avatar}
                alt="user"
                className="w-[120px] h-[120px] 800px:w-[150px] 800px:h-[150px] rounded-full object-cover border-[3px] border-green-600"
              />
              <div className="w-[30px] h-[30px] bg-[#E3E9EE] rounded-full flex items-center justify-center cursor-pointer absolute bottom-[5px] right-[5px]">
                <input
                  type="file"
                  name="file"
                  id="image"
                  className="hidden"
                  onChange={handleChange}
                />
                <label htmlFor="image">
                  <AiOutlineCamera />
                </label>
              </div>
            </div>
          </div>
          <br />
          <br />
          <div className="w-full px-5">
            <form onSubmit={handleSubmit} aria-required={true}>
              <div className="w-full 800px:flex pb-3 800px:gap-4">
                <div className="w-full 800px:w-[50%] mb-3">
                  <label className="block pb-2">Full Name</label>
                  <input
                    type="text"
                    className={`${styles.input} w-[95%]`}
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div className="w-full 800px:w-[50%] mb-3">
                  <label className="block pb-2">Email</label>
                  <input
                    type="email"
                    className={`${styles.input} w-[95%]`}
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>
              <div className="w-full 800px:flex pb-3">
                <div className="w-full 800px:w-[50%] mb-3">
                  <label className="block pb-2">Phone Number</label>
                  <input
                    type="number"
                    className={`${styles.input} w-[95%]`}
                    required
                    value={number}
                    onChange={(e) => setNumber(e.target.value)}
                  />
                </div>
              </div>
              <input
                className="w-[250px] h-[40px] border border-blue-700 text-center text-blue-700 rounded-[3px] mt-8 cursor-pointer"
                required
                value="Update"
                type="submit"
              />
            </form>
          </div>
        </>
      )}
      {active === 2 && (
        <div>
          <AllOrders />
        </div>
      )}
      {active === 3 && (
        <div>
          <AllRefundOrders />
        </div>
      )}
      {active === 5 && (
        <div>
          <TrackOrder />
        </div>
      )}
      {active === 6 && (
        <div>
          <ChangePassword />
        </div>
      )}
      {active === 7 && (
        <div>
          <Address />
        </div>
      )}
    </div>
  );
};

const AllOrders = () => {
  const REACT_APP_BASE_URL = process.env.REACT_APP_BASE_URL;
  const dispatch = useDispatch();
  const { allOrders } = useSelector((state) => state.order);
  const { currentUser } = useSelector((state) => state.user);
  useEffect(() => {
    const getAll = async () => {
      try {
        dispatch(OrderRequest());
        const { data } = await axios.get(
          `${REACT_APP_BASE_URL}/order/getAll/${currentUser._id}`
        );
        console.log(data);
        if (data.msg) {
          toast.error(data.msg);
          dispatch(OrderFailure(data.msg));
        }
        dispatch(getAllOrders(data));
      } catch (error) {
        dispatch(OrderFailure(error.response.data.msg));
        toast.error(error.response.data.msg);
        console.log(error);
      }
    };
    getAll();
  }, []);
  const columns = [
    { field: "id", headerName: "Order ID", minWidth: 150, flex: 0.7 },

    {
      field: "status",
      headerName: "Status",
      minWidth: 130,
      flex: 0.7,
      cellClassName: (params) => {
        return params.getValue(params.id, "status") === "Delivered"
          ? "greenColor"
          : "redColor";
      },
    },
    {
      field: "itemsQty",
      headerName: "Items Qty",
      type: "number",
      minWidth: 130,
      flex: 0.7,
    },

    {
      field: "total",
      headerName: "Total",
      type: "number",
      minWidth: 130,
      flex: 0.8,
    },

    {
      field: " ",
      flex: 1,
      minWidth: 150,
      headerName: "",
      type: "number",
      sortable: false,
      renderCell: (params) => {
        return (
          <>
            <Link to={`/user/order/${params.id}`}>
              <Button>
                <AiOutlineArrowRight size={20} />
              </Button>
            </Link>
          </>
        );
      },
    },
  ];
  const row = [];
  allOrders?.forEach((item) => {
    row.push({
      id: item._id,
      itemsQty: item.cart.length,
      total: "US$ " + item.totalPrice,
      status: item.status,
    });
  });
  return (
    <div className="pl-8 pt-1">
      <DataGrid
        rows={row}
        columns={columns}
        pageSize={10}
        disableSelectionOnClick
        autoHeight
      />
    </div>
  );
};

const AllRefundOrders = () => {
  const REACT_APP_BASE_URL = process.env.REACT_APP_BASE_URL;
  const dispatch = useDispatch();
  const { allOrders } = useSelector((state) => state.order);
  const { currentUser } = useSelector((state) => state.user);
  const refundOrders = allOrders?.filter(
    (order) => order.status === "Processing refund"
  );
  useEffect(() => {
    const getAll = async () => {
      try {
        dispatch(OrderRequest());
        const { data } = await axios.get(
          `${REACT_APP_BASE_URL}/order/getAll/${currentUser._id}`
        );
        if (data.msg) {
          toast.error(data.msg);
          dispatch(OrderFailure(data.msg));
        }
        dispatch(getAllOrders(data));
      } catch (error) {
        dispatch(OrderFailure(error.response.data.msg));
        toast.error(error.response.data.msg);
        console.log(error);
      }
    };
    getAll();
  }, []);
  const columns = [
    { field: "id", headerName: "Order ID", minWidth: 150, flex: 0.7 },

    {
      field: "status",
      headerName: "Status",
      minWidth: 130,
      flex: 0.7,
      cellClassName: (params) => {
        return params.getValue(params.id, "status") === "Delivered"
          ? "greenColor"
          : "redColor";
      },
    },
    {
      field: "itemsQty",
      headerName: "Items Qty",
      type: "number",
      minWidth: 130,
      flex: 0.7,
    },

    {
      field: "total",
      headerName: "Total",
      type: "number",
      minWidth: 130,
      flex: 0.8,
    },

    {
      field: " ",
      flex: 1,
      minWidth: 150,
      headerName: "",
      type: "number",
      sortable: false,
      renderCell: (params) => {
        return (
          <>
            <Link to={`/user/order/${params.id}`}>
              <Button>
                <AiOutlineArrowRight size={20} />
              </Button>
            </Link>
          </>
        );
      },
    },
  ];
  const row = [];
  refundOrders?.forEach((item) => {
    row.push({
      id: item._id,
      itemsQty: item.cart.length,
      total: "US$ " + item.totalPrice,
      status: item.status,
    });
  });
  return (
    <div className="pl-8 pt-1">
      <DataGrid
        rows={row}
        columns={columns}
        pageSize={10}
        autoHeight
        disableSelectionOnClick
      />
    </div>
  );
};

const TrackOrder = () => {
  const REACT_APP_BASE_URL = process.env.REACT_APP_BASE_URL;
  const dispatch = useDispatch();
  const { allOrders } = useSelector((state) => state.order);
  const { currentUser } = useSelector((state) => state.user);
  useEffect(() => {
    const getAll = async () => {
      try {
        dispatch(OrderRequest());
        const { data } = await axios.get(
          `${REACT_APP_BASE_URL}/order/getAll/${currentUser._id}`
        );
        console.log(data);
        if (data.msg) {
          toast.error(data.msg);
          dispatch(OrderFailure(data.msg));
        }
        dispatch(getAllOrders(data));
      } catch (error) {
        dispatch(OrderFailure(error.response.data.msg));
        toast.error(error.response.data.msg);
        console.log(error);
      }
    };
    getAll();
  }, []);
  const columns = [
    { field: "id", headerName: "Order ID", minWidth: 150, flex: 0.7 },

    {
      field: "status",
      headerName: "Status",
      minWidth: 130,
      flex: 0.7,
      cellClassName: (params) => {
        return params.getValue(params.id, "status") === "Delivered"
          ? "greenColor"
          : "redColor";
      },
    },
    {
      field: "itemsQty",
      headerName: "Items Qty",
      type: "number",
      minWidth: 130,
      flex: 0.7,
    },

    {
      field: "total",
      headerName: "Total",
      type: "number",
      minWidth: 130,
      flex: 0.8,
    },

    {
      field: " ",
      flex: 1,
      minWidth: 150,
      headerName: "",
      type: "number",
      sortable: false,
      renderCell: (params) => {
        return (
          <>
            <Link to={`/user/track/order/${params.id}`}>
              <Button>
                <MdTrackChanges size={20} />
              </Button>
            </Link>
          </>
        );
      },
    },
  ];
  const row = [];
  allOrders?.forEach((item) => {
    row.push({
      id: item._id,
      itemsQty: item.cart.length,
      total: "US$ " + item.totalPrice,
      status: item.status,
    });
  });
  return (
    <div className="pl-8 pt-1">
      <DataGrid
        rows={row}
        columns={columns}
        pageSize={10}
        autoHeight
        disableSelectionOnClick
      />
    </div>
  );
};

const ChangePassword = () => {
  const REACT_APP_BASE_URL = process.env.REACT_APP_BASE_URL;
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const { currentUser } = useSelector((state) => state.user);

  const passwordHandler = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.patch(
        `${REACT_APP_BASE_URL}/users/update-password`,
        { oldPassword, newPassword, confirmPassword, id: currentUser._id }
      );
      if (data.msg) {
        toast.error(data.msg);
      } else {
        toast.success("User updated");
        setNewPassword("");
        setOldPassword("");
        setConfirmPassword("");
      }
    } catch (error) {
      toast.error(error.response.data.msg);
      console.log(error);
    }
  };
  return (
    <div className="w-full px-5">
      <h1 className="text-xl font-[600] block text-center text-gray-700">
        Change Password
      </h1>
      <div className="w-full">
        <form
          onSubmit={passwordHandler}
          className="flex flex-col items-center mt-16"
        >
          <div className="w-full 800px:w-[50%] mb-5">
            <label className="block pb-2">Enter your old Password</label>
            <input
              type="password"
              className={`${styles.input} w-[95%]`}
              required
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
            />
          </div>
          <div className="w-full 800px:w-[50%] mb-5">
            <label className="block pb-2">Enter new Password</label>
            <input
              type="password"
              className={`${styles.input} w-[95%]`}
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>
          <div className="w-full 800px:w-[50%] mb-5">
            <label className="block pb-2">Confirm new password</label>
            <input
              type="password"
              className={`${styles.input} w-[95%]`}
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
          <input
            className="w-full 800px:w-[50%] h-[40px] border bg-white border-blue-700 text-center text-blue-700 rounded-[3px] mt-8 cursor-pointer hover:bg-gray-800 hover:text-white transition-all"
            required
            value="Update"
            type="submit"
          />
        </form>
      </div>
    </div>
  );
};

const Address = () => {
  const REACT_APP_BASE_URL = process.env.REACT_APP_BASE_URL;
  const [open, setOpen] = useState(false);
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const [zipCode, setZipCode] = useState();
  const [address1, setAddress1] = useState("");
  const [address2, setAddress2] = useState("");
  const [addressType, setAddressType] = useState("");
  const dispatch = useDispatch();
  const { currentUser, loading } = useSelector((state) => state.user);
  const addressTypeData = [
    {
      name: "Default",
    },
    {
      name: "Home",
    },
    {
      name: "Office",
    },
  ];
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (addressType === "" || country === "" || city === "") {
      toast.error("Please fill all the fields");
    } else {
      try {
        dispatch(updateAddressStart());
        const { data } = await axios.patch(
          `${REACT_APP_BASE_URL}/users/update-user-address`,
          {
            city,
            country,
            zipCode,
            address1,
            address2,
            addressType,
            userId: currentUser._id,
          }
        );

        if (data.msg) {
          toast.error(data.msg);
          dispatch(updateAddressFailure(data.msg));
          setOpen(false);
        } else {
          dispatch(updateSuccess(data));
          toast.success("User address updated");
          setOpen(false);
        }
      } catch (error) {
        dispatch(updateAddressFailure(error.response.data));
        toast.error(error.response.data.msg);
      }
    }
  };
  const handleDelete = async (address) => {
    //e.preventDefault()
    console.log(currentUser._id);
    try {
      dispatch(updateAddressStart());
      const { data } = await axios.post(
        `${REACT_APP_BASE_URL}/users/delete-address/${address._id}`,
        { userId: currentUser._id }
      );
      if (data.msg) {
        toast.error(data.msg);
        dispatch(updateAddressFailure(data.msg));
      } else {
        dispatch(deleteUserAddressSuccess(data));
        toast.success("Address deleted");
      }
    } catch (error) {
      dispatch(updateAddressFailure(error.message));
    }
  };
  return (
    <div className="w-full">
      {open && (
        <div className="fixed left-0 top-0 flex items-center justify-center h-screen w-full bg-[#0000004b]">
          <div className="w-[40%] h-[80vh] bg-white relative shadow-md overflow-y-scroll p-3 rounded-md">
            <div className="w-full flex justify-end">
              <RxCross1
                size={20}
                className="cursor-pointer"
                onClick={() => setOpen(false)}
              />
            </div>
            <h1 className="text-center font-Poppins text-xl">
              Add new address
            </h1>
            <div className="w-full">
              <form aria-required onSubmit={handleSubmit} className="w-full">
                <div className="w-full block p-4">
                  <div className="w-full pb-2">
                    <label className="block pb-2">Country</label>
                    <select
                      name=""
                      id=""
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      className="w-[95%] border h-[40px] rounded-sm"
                    >
                      <option value="" className="block pb-2">
                        Choose your country
                      </option>
                      {Country &&
                        Country.getAllCountries().map((country) => (
                          <option
                            className="block pb-2"
                            key={country.isoCode}
                            value={country.isoCode}
                          >
                            {country.name}
                          </option>
                        ))}
                    </select>
                  </div>
                  <div className="w-full pb-2">
                    <label className="block pb-2">City</label>
                    <select
                      name=""
                      id=""
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-[95%] border h-[40px] rounded-sm"
                    >
                      <option value="" className="block pb-2">
                        Choose your city
                      </option>
                      {State &&
                        State.getStatesOfCountry(country).map((city) => (
                          <option
                            className="block pb-2"
                            key={city.isoCode}
                            value={city.name}
                          >
                            {city.name}
                          </option>
                        ))}
                    </select>
                  </div>
                  <div className="w-full pb-2">
                    <label className="block pb-2">Address 1</label>
                    <input
                      type="address"
                      className={`${styles.input}`}
                      required
                      value={address1}
                      onChange={(e) => setAddress1(e.target.value)}
                    />
                  </div>
                  <div className="w-full pb-2">
                    <label className="block pb-2">Address 2</label>
                    <input
                      type="address"
                      className={`${styles.input}`}
                      required
                      value={address2}
                      onChange={(e) => setAddress2(e.target.value)}
                    />
                  </div>
                  <div className="w-full pb-2">
                    <label className="block pb-2">Zip Code</label>
                    <input
                      type="number"
                      className={`${styles.input}`}
                      required
                      value={zipCode}
                      onChange={(e) => setZipCode(e.target.value)}
                    />
                  </div>
                  <div className="w-full pb-2">
                    <label className="block pb-2">Address Type</label>
                    <select
                      name=""
                      id=""
                      value={addressType}
                      onChange={(e) => setAddressType(e.target.value)}
                      className="w-[95%] border h-[40px] rounded-sm"
                    >
                      <option value="" className="block pb-2">
                        Choose address type
                      </option>
                      {addressTypeData &&
                        addressTypeData.map((addType) => (
                          <option
                            className="block pb-2"
                            key={addType.name}
                            value={addType.name}
                          >
                            {addType.name}
                          </option>
                        ))}
                    </select>
                  </div>
                  <div className="w-full pb-2">
                    <input
                      type="submit"
                      className={`${styles.input} mt-5 cursor-pointer hover:bg-gray-800 hover:text-white transition-all`}
                      required
                      readOnly
                    />
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
      <div className="flex w-full items-center justify-between ">
        <h1 className="text-xl font-[600] text-gray-700">My Addresses</h1>
        <div
          onClick={() => setOpen(true)}
          className={`${styles.button} !rounded-md`}
        >
          <span className="text-white">Add New</span>
        </div>
      </div>
      <br />
      {currentUser?.addresses?.map((address, i) => (
        <div
          key={i}
          className="w-full bg-white h-[70px] rounded-[4px] flex items-center px-3 space-x-2 shadow-md justify-between"
        >
          <div className="flex-1 items-center">
            <h5 className="pl-5 font-[600]">{address.addressType}</h5>
          </div>
          <div className="flex-1  items-center">
            <h6>{address.address1}</h6>
          </div>
          <div className="flex-1  items-center">
            <h6>{address.address2}</h6>
          </div>
          <div className="flex-1  items-center">
            <h6>+880{currentUser.phone}</h6>
          </div>
          <div className="min-w-[10%] flex-1  items-center justify-between pl-8">
            <AiOutlineDelete
              size={20}
              className="cursor-pointer hover:text-red-600"
              onClick={() => handleDelete(address)}
            />
          </div>
        </div>
      ))}
      {currentUser?.addresses.length === 0 && (
        <div className="text-center pt-5 text-lg">
          <h5>No addresses available</h5>
        </div>
      )}
    </div>
  );
};
export default ProfileContent;
