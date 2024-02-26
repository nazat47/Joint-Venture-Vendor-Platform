import React, { useEffect, useState } from "react";
import Header from "../components/layout/Header";
import styles from "../styles/styles";
import { useSelector } from "react-redux";
import ProductCard from "../components/route/product-card/ProductCard";

const BestSelling = () => {
  const { allProducts, loading } = useSelector((state) => state.product);
  const [data, setData] = useState([]);
  useEffect(() => {
    try {
      const allProdData = [...allProducts];
      const sortData = allProdData.sort((a, b) => b?.soldOut - a?.soldOut);
      setData(sortData);
    } catch (error) {
      console.log(error);
    }
  }, []);
  return (
    <div>
      <Header activeHeading={2} />
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

export default BestSelling;
