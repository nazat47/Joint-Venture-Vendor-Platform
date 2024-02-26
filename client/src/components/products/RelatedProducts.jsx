import React, { useEffect, useState } from "react";
import {  useSelector } from "react-redux";
import styles from "../../styles/styles";
import ProductCard from "../route/product-card/ProductCard";

const RelatedProducts = ({ product }) => {
  const { allProducts } = useSelector((state) => state.product);
  const [products, setProducts] = useState(null);
  useEffect(() => {
    const prod = allProducts?.filter(
      (item) => item.category === product.category
    );
    setProducts(prod);
  }, []);
  return (
    <div className="p-4">
      {product && (
        <div className={`${styles.section}`}>
          <h2 className={`${styles.heading} text-xl font-[500] border-b mb-3`}>
            Related Product
          </h2>
          <div className="grid grid-cols-1 gap-2 md:grid-cols-2 md:gap-7 lg:grid-cols-4 lg:gap-7 xl:grid-cols-5 xl:gap-9">
            {products?.map((prod, i) => (
              <ProductCard key={i} product={prod} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default RelatedProducts;
