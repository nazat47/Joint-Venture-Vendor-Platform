import React from "react";
import styles from "../../../styles/styles";
import { brandingData, categoriesData } from "../../../static/data";
import { useNavigate } from "react-router-dom";
const Categories = () => {
  const navigate = useNavigate();
  const handleSubmit = (cat) => {
    navigate(`/products?category=${cat.title}`);
  };
  return (
    <>
      <div className={`${styles.section} hidden sm:block`}>
        <div className="branding my-12 flex justify-between w-full shadow-md bg-white p-5 rounded-md">
          {brandingData?.map((brand, i) => (
            <div className="flex items-start" key={i}>
              {brand.icon}
              <div className="px-3">
                <h3 className="font-bold text-sm md:text-base">
                  {brand.title}
                </h3>
                <p className="text-xs md:text-sm">{brand.Description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div
        className={`${styles.section} bg-white p-6 rounded-lg mb-12`}
        id="categories"
      >
        <div className="grid grid-cols-1 gap-1 md:grid-cols-2 md:gap-3 lg:grid-cols-4 lg:gap-5 xl:grid-cols-5 xl:gap-7 ">
          {categoriesData?.map((category, i) => (
            <div
              onClick={() => handleSubmit(category)}
              className="w-full h-24 flex items-center justify-between shadow-md cursor-pointer overflow-hidden"
              key={i}
            >
              <h5 className="text-lg leading-1.5 font-semibold">{category.title}</h5>
              <img
                src={category.image_Url}
                alt="category"
                className="w-24 object-cover"
              ></img>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Categories;
