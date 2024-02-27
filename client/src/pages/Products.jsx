import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Header from "../components/layout/Header";
import styles from "../styles/styles";
import { useLocation } from "react-router-dom";
import { productData } from "../static/data";
import ProductCard from "../components/route/product-card/ProductCard";

const Products = () => {
  const { allProducts, loading } = useSelector((state) => state.product);
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const categoryData = searchParams.get("category");
  const [data, setData] = useState([]);
  useEffect(() => {
    const allProdData = [...allProducts];
    if (categoryData === null) {
      const prodData = allProdData;
      setData(prodData);
    } else {
      const prodData = allProdData.filter(
        (prod) => prod.category === categoryData
      );
      setData(prodData);
    }
    window.scrollTo();
  }, []);
  return (
    <div>
      <Header activeHeading={3} />
      <br />
      <br />
      <div className={`${styles.section}`}>
        <div className="grid grid-cols-1 gap-2 md:grid-cols-2 md:gap-7 lg:grid-cols-4 lg:gap-7 xl:grid-cols-5 xl:gap-9">
          {data?.map((prod, i) => (
            <ProductCard key={i} product={prod} />
          ))}
        </div>
        {data?.length === 0 && (
          <h1 className="text-center font-semibold w-full pb-[110px]">
            No products found!
          </h1>
        )}
      </div>
    </div>
  );
};

export default Products;
