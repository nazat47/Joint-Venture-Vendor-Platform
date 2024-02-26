import React, { useState } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import styles from "../../styles/styles";
import { Link } from "react-router-dom";
import { RxAvatar } from "react-icons/rx";
import axios from "axios";
import { toast } from "react-toastify";
import { app } from "../../firebase";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";

const ShopCreate = () => {
  const REACT_APP_BASE_URL = process.env.REACT_APP_BASE_URL;
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState(null);
  const [address, setAddress] = useState("");
  const [zipCode, setZipCode] = useState(null);
  const [avatar, setAvatar] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [errMsg, setErrMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 4000);
    const newForm = new FormData();
    newForm.append("name", name);
    newForm.append("email", email);
    newForm.append("password", password);
    newForm.append("file", avatar);
    newForm.append("phone", phone);
    newForm.append("address", address);
    newForm.append("zipCode", zipCode);
    const config = { headers: { "Content-Type": "multipart/form-data" } };
    await axios
      .post(`${REACT_APP_BASE_URL}/shop/create`, newForm, config)
      .then((res) => {
        if (res.data?.message) {
          toast.success(res.data?.message);
          setName("");
          setEmail("");
          setAvatar("");
          setPassword("");
          setAddress("");
          setPhone(null);
          setZipCode(null);
        }
      })
      .catch((err) => {
        setError(true);
        setErrMsg(err.message);
        //toast.error(err.response.data.msg);
      });
  };
  const handleFileInput = (e) => {
    const file = e.target.files[0];
    const promise = storeImage(file);
    promise
    .then((url) => {
      console.log("Image uploaded successfully");
      setAvatar(url);
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
            console.log(downloadURL)
            resolve(downloadURL);
          });
        }
      );
    });
  
  };
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-xl">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-slate-800">
          Register as a Seller
        </h2>
      </div>
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-xl">
        <div className="bg-white py-8 px-4 shadow-lg sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="name"
                className="block text-md font-medium text-slate-700"
              >
                Shop name
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  name="name"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-blue-400 focus:border-blue-400 sm:text-sm"
                />
              </div>
            </div>
            <div>
              <label
                htmlFor="email"
                className="block text-md font-medium text-slate-700"
              >
                Email
              </label>
              <div className="mt-1">
                <input
                  type="email"
                  name="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-blue-400 focus:border-blue-400 sm:text-sm"
                />
              </div>
            </div>
            <div>
              <label
                htmlFor="address"
                className="block text-md font-medium text-slate-700"
              >
                Address
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  name="address"
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-blue-400 focus:border-blue-400 sm:text-sm"
                />
              </div>
            </div>
            <div>
              <label
                htmlFor="name"
                className="block text-md font-medium text-slate-700"
              >
                Zip Code
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  name="zipcode"
                  required
                  value={zipCode}
                  onChange={(e) => setZipCode(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-blue-400 focus:border-blue-400 sm:text-sm"
                />
              </div>
            </div>
            <div>
              <label
                htmlFor="phone"
                className="block text-md font-medium text-slate-700"
              >
                Phone Number
              </label>
              <div className="mt-1">
                <input
                  type="number"
                  name="phone"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-blue-400 focus:border-blue-400 sm:text-sm"
                />
              </div>
            </div>
            <div>
              <label
                htmlFor="password"
                className="block text-md font-medium text-slate-700"
              >
                Password
              </label>
              <div className="mt-1  relative ">
                <input
                  type={`${visible ? "text" : "password"}`}
                  name="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-blue-400 focus:border-blue-400 sm:text-sm"
                />
                {visible ? (
                  <AiOutlineEye
                    className="absolute right-2 top-2 cursor-pointer"
                    size={20}
                    onClick={() => setVisible(false)}
                  />
                ) : (
                  <AiOutlineEyeInvisible
                    className="absolute right-2 top-2 cursor-pointer"
                    size={20}
                    onClick={() => setVisible(true)}
                  />
                )}
              </div>
            </div>
            <div className="">
              <label
                htmlFor="avatar"
                className="block text-sm font-medium text-slate-700"
              >
                <div className="mt-2 flex items-center">
                  <span className="inline-block h-8 w-8 rounded-full overflow-hidden">
                    {avatar ? (
                      <img
                        src={avatar}
                        alt="avatar"
                        className="h-full w-full object-cover rounded-full"
                      />
                    ) : (
                      <RxAvatar className="h-8 w-8" />
                    )}
                  </span>
                  <label
                    htmlFor="file-input"
                    className="ml-5 flex items-center justify-center px-4 py-2 border border-slate-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                  >
                    <span>Upload a file</span>
                    <input
                      type="file"
                      name="avatar"
                      id="file-input"
                      accept=".jpg,.jpeg,.png"
                      onChange={handleFileInput}
                      className="sr-only"
                    />
                  </label>
                </div>
              </label>
            </div>
            <div className="">
              {error && <p style={{ color: "red" }}>{errMsg}</p>}
              <button
                type="submit"
                disabled={loading}
                className="group relative w-full h-[40px] flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-slate-700 hover:bg-slate-800"
              >
                {loading ? "Loading..." : "Register"}
              </button>
            </div>
            <div className={`${styles.normalFlex} w-full`}>
              <h4>Already have an account?</h4>
              <Link
                to="/login-shop"
                className="text-blue-700 pl-2 hover:underline"
              >
                Sign in
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ShopCreate;
