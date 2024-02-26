import React, { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import axios from "axios";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import ProductDetails from "../components/products/ProductDetails";
import RelatedProducts from "../components/products/RelatedProducts";
import {
  ProductFailure,
  ProductRequest,
  getAllProducts,
} from "../redux/reducers/productSlice";
import Loader from "../components/layout/Loader";

const ProductDetailsPage = () => {
  const REACT_APP_BASE_URL = process.env.REACT_APP_BASE_URL;
  const dispatch = useDispatch();
  const { allProducts, loading } = useSelector((state) => state.product);
  const { allEvents } = useSelector((state) => state.event);
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [searchParams] = useSearchParams();
  const eventData = searchParams.get("isEvent");

  useEffect(() => {
    const getall = async () => {
      try {
        dispatch(ProductRequest());
        const { data } = await axios.get(
          `${REACT_APP_BASE_URL}/product/getAllProducts`
        );
        if (data.msg) {
          dispatch(ProductFailure(data.msg));
          toast.error(data.msg);
        }
        dispatch(getAllProducts(data));
      } catch (error) {
        dispatch(ProductFailure(error.message));
        toast.error(error.message);
      }
    };
    getall();
    if (eventData === null) {
      const prod = allProducts?.find((prod) => prod._id === id);
      setData(prod);
    } else {
      const prod = allEvents?.find((prod) => prod._id === id);
      setData(prod);
    }
  }, [id]);

  return (
    <div>
      <Header />

      <ProductDetails product={data} />
      {!eventData && <>{data && <RelatedProducts product={data} />}</>}

      <Footer />
    </div>
  );
};

export default ProductDetailsPage;
