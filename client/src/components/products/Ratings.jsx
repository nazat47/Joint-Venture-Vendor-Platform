import React from "react";
import { AiFillStar, AiOutlineStar } from "react-icons/ai";
import { BsStarHalf } from "react-icons/bs";

const Ratings = ({ ratings }) => {
  const stars = [];
  if (ratings > 0) {
    for (let i = 1; i <= 5; i++) {
      if (i <= ratings) {
        stars.push(
          <AiFillStar
            key={i}
            size={20}
            className="cursor-pointer mr-2"
            color="#f6b100"
          />
        );
      } else if (i === Math.ceil(ratings) && !Number.isInteger(ratings)) {
        stars.push(
          <BsStarHalf
            key={i}
            size={20}
            className="cursor-pointer mr-2"
            color="#f6b100"
          />
        );
      } else {
        stars.push(
          <AiOutlineStar
            key={i}
            size={20}
            className="cursor-pointer mr-2"
            color="#f6b100"
          />
        );
      }
    }
  } else {
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <AiOutlineStar
          key={i}
          size={20}
          className="cursor-pointer mr-2"
          color="#f6b100"
        />
      );
    }
  }
  return <div className="flex">{stars}</div>;
};

export default Ratings;
