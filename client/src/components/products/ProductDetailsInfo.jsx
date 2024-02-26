import React, { useState } from "react";
import styles from "../../styles/styles";
import { Link } from "react-router-dom";
import Ratings from "./Ratings";

const ProductDetailsInfo = ({ allProducts, product }) => {
  const [active, setActive] = useState(1);
  const totalProductReviews = allProducts?.reduce(
    (acc, product) => (acc += product.review.length),
    0
  );
  const totalRatings = allProducts?.reduce(
    (acc, product) =>
      (acc += product.review?.reduce((sum, rev) => (sum += rev.rating), 0)),
    0
  );
  const avgRating = totalRatings / totalProductReviews || 0;
  return (
    <div className="bg-[#f5f6fb] shadow-md px-3 800px:px-10 py-2 rounded ">
      <div className="w-full flex justify-between border-b pt-10 pb-2">
        <div className="relative">
          <h5
            onClick={() => setActive(1)}
            className="text-gray-800 text-lg px-1 leading-5 font-[500] cursor-pointer 800px:text-xl"
          >
            Product Details
          </h5>
          {active === 1 && <div className={`${styles.active_indicator}`}></div>}
        </div>
        <div className="relative">
          <h5
            onClick={() => setActive(2)}
            className="text-gray-800 text-lg px-1 leading-5 font-[500] cursor-pointer 800px:text-xl"
          >
            Product Reviews
          </h5>
          {active === 2 && <div className={`${styles.active_indicator}`}></div>}
        </div>
        <div className="relative">
          <h5
            onClick={() => setActive(3)}
            className="text-gray-800 text-lg px-1 leading-5 font-[500] cursor-pointer 800px:text-xl"
          >
            Seller Information
          </h5>
          {active === 3 && <div className={`${styles.active_indicator}`}></div>}
        </div>
      </div>
      {active === 1 ? (
        <>
          <p className="py-2 text-lg leading-8 pb-10 whitespace-pre-line">
            {product.name}
          </p>
          <p className="py-2 text-lg leading-8 pb-10 whitespace-pre-line">
            {product.description}
          </p>
        </>
      ) : null}
      {active === 2 && (
        <div className="w-full text-xl p-3 min-h-[40vh] flex flex-col items-center overflow-y-scroll">
          {product?.review?.map((rev, i) => (
            <div className="flex my-2 w-full">
              <img
                src={rev?.user?.avatar}
                alt="user"
                className="h-[50px] w-[50px] rounded-full"
              />
              <div className="ml-3">
                <div className="w-full flex items-center space-x-3">
                  <h1 className="font-[500]">{rev.user.username}</h1>
                  <Ratings ratings={product?.ratings} />
                </div>
                <p className="">{rev.message}</p>
              </div>
            </div>
          ))}
          <div className="w-full flex justify-center">
            {!product?.review && <h5>No reviews yet!</h5>}
          </div>
        </div>
      )}
      {active === 3 && (
        <div className="w-full block 800px:flex p-5">
          <div className="w-full 800px:w-[50%]">
            <div className="flex items-center">
              <Link to={`/shop/preview/${product.shop._id}`}>
                <img
                  src={product.shop.avatar}
                  alt="shop"
                  className="w-[50px] h-[50px] rounded-full"
                />
              </Link>
              <div className="ml-2">
                <h3 className={`${styles.shop_name} pt-1 pb-1`}>
                  {product.shop.name}
                </h3>
                <h5 className="pb-2 text-sm">({avgRating}/5) ratings</h5>
              </div>
            </div>
            <p className="pt-2">{product.shop.description}</p>
          </div>
          <div className="w-full 800px:w-[50%] mt-5 800px:mt-0 800px:flex flex-col items-end">
            <div className="text-left">
              <h5 className="font-[600]">
                Joined on{" "}
                <span className="font-[500]">
                  {product.shop.createdAt.slice(0, 10)}
                </span>
              </h5>
              <h5 className="font-[600] pt-3">
                Total products:{" "}
                <span className="font-[500]">{allProducts.length}</span>
              </h5>
              <h5 className="font-[600] pt-3">
                Total reviews:{" "}
                <span className="font-[500]">{totalProductReviews}</span>
              </h5>
              <Link to="/">
                <div
                  className={`${styles.button} !rounded-[4px] h-[39.5px] mt-3`}
                >
                  <h4 className="text-white">Visit Shop</h4>
                </div>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetailsInfo;
