import React from "react";
import styles from "../../../styles/styles";
import { useSelector } from "react-redux";
import ProductCard from "../product-card/ProductCard";

const FeaturedProducts = () => {
  const { allProducts } = useSelector((state) => state.product);
  const sortProd=allProducts.slice(0,5)
  return (
    <div className="mt-12">
      <div className={`${styles.section}`}>
        <div className={`${styles.heading}`}>
          <h1>Featured Products</h1>
        </div>
        <div className="grid grid-cols-1 gap-2 md:grid-cols-2 md:gap-7 lg:grid-cols-4 lg:gap-7 xl:grid-cols-5 xl:gap-9">
          {sortProd?.map((prod, i) => (
            <ProductCard product={prod} key={i} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default FeaturedProducts;
