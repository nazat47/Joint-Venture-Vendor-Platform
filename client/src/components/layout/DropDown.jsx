import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "../../styles/styles";
const DropDown = ({ categoriesData, setDropDown }) => {
  const navigate = useNavigate();
  const handleSubmit = (category) => {
    navigate(`/products?category=${category.title}`);
    setDropDown(false);
    window.location.reload();
  };
  return (
    <div className="pb-4 w-[270px] bg-white absolute z-30 rounded-b-md shadow-md">
      {categoriesData?.map((cat, i) => (
        <div className={`${styles.normalFlex}`} key={i} onClick={()=>handleSubmit(cat)}>
          <img
            src={cat.image_Url}
            alt="category"
            className="w-[25px] h-[25px] object-contain ml-3 select-none"
          ></img>
          <h3 className="m-3 cursor-pointer select-none">{cat.title}</h3>
        </div>
      ))}
    </div>
  );
};

export default DropDown;
