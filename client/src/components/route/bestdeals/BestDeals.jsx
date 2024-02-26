import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import styles from "../../../styles/styles";
import ProductCard from "../product-card/ProductCard";
import Loader from "../../layout/Loader";

const BestDeals = () => {
  const { allProducts, loading } = useSelector((state) => state.product);
  const [data, setData] = useState([]);
  useEffect(() => {
    try {
      const allProdData = [...allProducts];
      const sortData = allProdData.sort((a, b) => b?.soldOut - a?.soldOut);
      setData(sortData.slice(0, 5));
    } catch (error) {
      console.log(error);
    }
  }, []);
  return (
    <div className="">
      {loading ? (
        <Loader />
      ) : (
        <div className={`${styles.section}`}>
          <div className={`${styles.heading}`}>
            <h1>Best Deals</h1>
          </div>
          <div className="grid grid-cols-1 gap-2 md:grid-cols-2 md:gap-7 lg:grid-cols-4 lg:gap-7 xl:grid-cols-5 xl:gap-9">
            {data?.map((data, i) => (
              <ProductCard product={data} key={i} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default BestDeals;
