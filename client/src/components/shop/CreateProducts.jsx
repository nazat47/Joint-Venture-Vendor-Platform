import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { categoriesData } from "../../static/data";
import { AiOutlinePlusCircle } from "react-icons/ai";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../../firebase";
import { toast } from "react-toastify";
import axios from "axios";
import {
  ProductFailure,
  ProductRequest,
  createProductSuccess,
} from "../../redux/reducers/productSlice";

const CreateProducts = () => {
  const REACT_APP_BASE_URL = process.env.REACT_APP_BASE_URL;
  const { currentShop } = useSelector((state) => state.shop);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [name, setName] = useState("");
  const [images, setImage] = useState([]);
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [tags, setTags] = useState("");
  const [originalPrice, setOriginalPrice] = useState();
  const [discountPrice, setDiscountPrice] = useState();
  const [stock, setStock] = useState();

  const config = { headers: { "Content-Type": "multipart/form-data" } };
  const handleFileUpload = (e) => {
    e.preventDefault();
    let files = Array.from(e.target.files);
    const promises = [];
    for (let i = 0; i < files.length; i++) {
      promises.push(storeImage(files[i]));
    }
    Promise.all(promises)
      .then((urls) => {
        setImage((prev) => [...prev, ...urls]);
      })
      .catch((err) => {
        toast.error(err.message);
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
            resolve(downloadURL);
          });
        }
      );
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(ProductRequest());

    const newForm = new FormData();
    images.forEach((image) => {
      newForm.append("images", image);
    });
    newForm.append("name", name);
    newForm.append("description", description);
    newForm.append("category", category);
    newForm.append("tags", tags);
    newForm.append("originalPrice", originalPrice);
    newForm.append("discountPrice", discountPrice);
    newForm.append("stock", stock);
    newForm.append("shopId", currentShop._id);
    try {
      const { data } = await axios.post(
        `${REACT_APP_BASE_URL}/product/create`,
        newForm,
        config
      );
      if (data.msg) {
        toast.error(data.msg);
      }
      dispatch(createProductSuccess(data));
      toast.success("Product created");
      navigate("/dashboard-products");
    } catch (error) {
      dispatch(ProductFailure(error.message));
      toast.error(error.message);
    }
  };
  return (
    <div className="w-[90%] 800px:w-[50%] font-Poppins bg-white shadow h-[80vh] rounded-sm p-3 overflow-y-scroll">
      <h5 className="text-xl text-center font-Poppins">Create Product</h5>
      <form onSubmit={handleSubmit}>
        <br />
        <div>
          <label className="pb-2">
            Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="name"
            value={name}
            required
            placeholder="Enter your product name"
            onChange={(e) => setName(e.target.value)}
            className="mt-2 mb-3 appearance-none block text-gray-800 w-full px-3 h-[35px] border border-gray-300 rounded-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>
        <div>
          <label className="pb-2">
            Description <span className="text-red-500">*</span>
          </label>
          <textarea
            cols="30"
            rows="8"
            name="description"
            value={description}
            required
            placeholder="Enter your product description"
            onChange={(e) => setDescription(e.target.value)}
            className="mt-2 mb-3 appearance-none block text-gray-800 w-full px-3 h-[35px] border border-gray-300 rounded-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>
        <div>
          <label className="pb-2">
            Category <span className="text-red-500">*</span>
          </label>
          <select
            className="w-full mt-2 mb-3 border h-[35px] rounded-sm  text-gray-700"
            value={category}
            required
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="Choose a category" selected={true}>
              Choose a category
            </option>
            {categoriesData.map((cat) => (
              <option value={cat.title} key={cat.title}>
                {cat.title}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="pb-2">Tags</label>
          <input
            type="text"
            name="tags"
            value={tags}
            placeholder="Enter your product tag"
            onChange={(e) => setTags(e.target.value)}
            className="mt-2 mb-3 appearance-none block text-gray-800 w-full px-3 h-[35px] border border-gray-300 rounded-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>
        <div>
          <label className="pb-2">Price</label>
          <input
            type="number"
            name="originalPrice"
            value={originalPrice}
            placeholder="Enter your product price"
            onChange={(e) => setOriginalPrice(e.target.value)}
            className="mt-2 mb-3 appearance-none block text-gray-800 w-full px-3 h-[35px] border border-gray-300 rounded-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>
        <div>
          <label className="pb-2">
            Discount Price <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            name="discountPrice"
            value={discountPrice}
            required
            placeholder="Enter your product discount price"
            onChange={(e) => setDiscountPrice(e.target.value)}
            className="mt-2 mb-3 appearance-none block text-gray-800 w-full px-3 h-[35px] border border-gray-300 rounded-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>
        <div>
          <label className="pb-2">
            Product in stock <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            name="stock"
            value={stock}
            required
            placeholder="Enter your product stock"
            onChange={(e) => setStock(e.target.value)}
            className="mt-2 mb-3 appearance-none block text-gray-800 w-full px-3 h-[35px] border border-gray-300 rounded-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>
        <br />
        <div>
          <label className="pb-2">
            Upload Images <span className="text-red-500">*</span>
          </label>
          <input
            type="file"
            id="upload"
            onChange={handleFileUpload}
            multiple
            className="hidden"
          />
          <div className="w-full flex items-center flex-wrap">
            <label htmlFor="upload">
              <AiOutlinePlusCircle
                size={30}
                className="mt-3 cursor-pointer"
                color="gray"
              />
            </label>
            {images?.map((image, i) => (
              <img
                src={image}
                key={i}
                alt="product"
                className="h-[120px] w-[120px] object-contain m-2"
              />
            ))}
          </div>
          <br />
          <div>
            <input
              type="submit"
              value="Create"
              className="mt-2 mb-3 appearance-none block text-gray-800 font-bold w-full px-3 h-[35px] border border-gray-700 rounded-smhover:outline-none cursor-pointer hover:text-blue-700 hover:border-blue-700 sm:text-sm"
            />
          </div>
        </div>
      </form>
    </div>
  );
};

export default CreateProducts;
