import React from "react";
import Lottie from "react-lottie";
import animationsData from "../../assets/animations/Animation-1707647929671.json";
const Loader = () => {
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationsData,
    rendererSettings: {
      preserveAspectRatio: "xMidyMid slice",
    },
  };
  return (
    <div>
      <div className="w-[full] h-screen flex items-center justify-center">
        <Lottie options={defaultOptions} width={100} height={100} />
      </div>
    </div>
  );
};

export default Loader;
