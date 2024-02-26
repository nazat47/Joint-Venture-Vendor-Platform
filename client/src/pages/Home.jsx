import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import Header from "../components/layout/Header";
import Hero from "../components/route/hero/Hero";
import Categories from "../components/route/categories/Categories";
import BestDeals from "../components/route/bestdeals/BestDeals";
import FeaturedProducts from "../components/route/featured-products/FeaturedProducts";
import Events from "../components/route/events/Events";
import Sponsored from "../components/route/sponsored/Sponsored";
import Footer from "../components/layout/Footer";
import {
  ProductFailure,
  ProductRequest,
  getAllProducts,
} from "../redux/reducers/productSlice";


const Home = () => {
  const REACT_APP_BASE_URL = process.env.REACT_APP_BASE_URL;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state) => state.user);
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    } else {
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
    }
  }, []);
  return (
    <div className="">
      <Header activeHeading={1} />
      <Hero />
      <Categories />
      <BestDeals />
      <Events />
      <FeaturedProducts />
      <Sponsored />
      <Footer />
    </div>
  );
};

export default Home;
