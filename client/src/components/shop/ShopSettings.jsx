import React, { useState } from "react";
import { AiOutlineCamera } from "react-icons/ai";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { toast } from "react-toastify";
import {
  getDownloadURL,
  ref,
  getStorage,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../../firebase";
import styles from "../../styles/styles";
import { signInSuccess } from "../../redux/reducers/shopSlice";

const ShopSettings = () => {
  const REACT_APP_BASE_URL = process.env.REACT_APP_BASE_URL;
  const dispatch = useDispatch();
  const { currentShop } = useSelector((state) => state.shop);
  const [avatar, setAvatar] = useState("");
  const [name, setName] = useState(currentShop?.name || "");
  const [description, setDescription] = useState(
    currentShop?.description || ""
  );
  const [address, setAddress] = useState(currentShop?.address || "");
  const [zipCode, setZipCode] = useState(currentShop?.zipCode || "");
  const [phone, setPhone] = useState(currentShop?.phone || "");
  const handleChange = (e) => {
    e.preventDefault();
    const file = e.target.files[0];
    const promise = storeImage(file);
    promise
      .then(async (url) => {
        console.log("Image uploaded successfully");
        setAvatar(url);

        try {
          const { data } = await axios.patch(
            `${REACT_APP_BASE_URL}/shop/update-avatar`,
            { id: currentShop._id, avatar: url }
          );
          if (data.msg) {
            toast.error(data.msg);
          } else {
            toast.success("Profile updated");
            console.log(data);
            dispatch(signInSuccess(data));
            setAvatar("");
          }
        } catch (error) {
          toast.error(error.message);
          console.log(error);
        }
      })
      .catch((error) => {
        console.error("Error uploading image:", error);
      });
  };

  const storeImage = async (file) => {
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
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            console.log(downloadURL);
            resolve(downloadURL);
          });
        }
      );
    });
  };

  const updateHandler = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.patch(`${REACT_APP_BASE_URL}/shop/update`, {
        id: currentShop._id,
        name,
        phone,
        zipCode,
        address,
        description,
      });
      if (data.msg) {
        toast.error(data.msg);
      } else {
        toast.success("Profile updated");
        console.log(data);
        dispatch(signInSuccess(data));
      }
    } catch (error) {
      toast.error(error.message);
      console.log(error);
    }
  };
  return (
    <div className="w-full min-h-screen flex flex-col items-center">
      <div className="flex w-full 800px:w-[80%] flex-col justify-center items-center my-5">
        <div className=" w-full flex items-center justify-center">
          <div className="relative">
            <img
              src={avatar ? avatar : currentShop?.avatar}
              alt="shop"
              className=" w-[250px] h-[250px] rounded-full cursor-pointer"
            />
            <div className="w-[30px] h-[30px] bg-[#fff] rounded-full flex items-center justify-center cursor-pointer absolute bottom-[10px] right-[15px]">
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
        <form
          onSubmit={updateHandler}
          aria-required={true}
          className="w-[80%] 800px:w-full flex flex-col items-center mt-16"
        >
          <div className="w-full 800px:w-[50%] mt-5">
            <label className="block pb-2">Shop name</label>
            <input
              type="name"
              placeholder={`${currentShop.name}`}
              value={name}
              className={`${styles.input} w-[95%]`}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="w-full 800px:w-[50%] mt-5">
            <label className="block pb-2">Shop description</label>
            <input
              type="text"
              placeholder={`${
                currentShop?.description
                  ? currentShop?.description
                  : "Enter description"
              }`}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className={`${styles.input} w-[95%]`}
            />
          </div>
          <div className="w-full 800px:w-[50%] mt-5">
            <label className="block pb-2">Shop address</label>
            <input
              type="address"
              placeholder={`${
                currentShop?.address ? currentShop?.address : "Enter Address"
              }`}
              value={address}
              className={`${styles.input} w-[95%]`}
              onChange={(e) => setAddress(e.target.value)}
              required
            />
          </div>
          <div className="w-full 800px:w-[50%] mt-5">
            <label className="block pb-2">Shop phone</label>
            <input
              type="number"
              placeholder={`${
                currentShop?.phone ? currentShop?.phone : "Enter Phone number"
              }`}
              value={phone}
              className={`${styles.input} w-[95%]`}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
          </div>
          <div className="w-full 800px:w-[50%] mt-5">
            <label className="block pb-2">Zip Code</label>
            <input
              type="number"
              placeholder={`${
                currentShop?.zipCode ? currentShop?.zipCode : "Enter ZipCode"
              }`}
              value={zipCode}
              className={`${styles.input} w-[95%]`}
              onChange={(e) => setZipCode(e.target.value)}
              required
            />
          </div>
          <div className="w-full 800px:w-[50%] mt-5">
            <input
              type="submit"
              value="Update"
              className={`${styles.input} w-[95%] !border-gray-800 hover:bg-slate-600 hover:text-white cursor-pointer`}
              required
              readOnly
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default ShopSettings;
