import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import styles from "../../styles/styles";
import ShopInfo from "../../components/shop/ShopInfo";
import ShopProfileData from "../../components/shop/ShopProfileData";
import axios from "axios";
import ShopPreviewInfo from "../../components/shop/ShopPreviewInfo";
import ShopProfilePreview from "../../components/shop/ShopProfilePreview";
const ShopPreviewPage = () => {
  const REACT_APP_BASE_URL = process.env.REACT_APP_BASE_URL;
  const dispatch = useDispatch();
  const { id } = useParams();
  const [previewShop, setPreviewShop] = useState(null);
  useEffect(() => {
    const getall = async () => {
      try {
        const { data } = await axios.get(
          `${REACT_APP_BASE_URL}/shop/get/${id}`
        );
        if (data.msg) {
          console.log(data.msg);
        }
        console.log("man")
        console.log(data)
        setPreviewShop(data);
      } catch (error) {
        console.log(error.message);
      }
    };
    getall();
  }, []);
  return (
    <div className={`${styles.section} bg-[#f5f5f5]`}>
      <div className="w-full 800px:flex py-10 justify-between">
        <div className="800px:w-[25%] bg-[#fff] rounded-[4px] shadow-sm 800px:overflow-y-scroll 800px:h-[90vh] 800px:sticky top-10 left-0 z-10">
          <ShopPreviewInfo isOwner={false} previewShop={previewShop}/>
        </div>
        <div className="800px:w-[72%] mt-5 800px:mt-['unset'] rounded-[4px]">
          <ShopProfilePreview isOwner={false} previewShop={previewShop}/>
        </div>
      </div>
    </div>
  );
};

export default ShopPreviewPage;
