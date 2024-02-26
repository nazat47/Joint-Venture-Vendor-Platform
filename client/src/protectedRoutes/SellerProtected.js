import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import Loader from "../components/layout/Loader";

export const SellerProtected = ({ children }) => {
  const { isAuthenticated, currentShop, loading } = useSelector(
    (state) => state.shop
  );

  if (!isAuthenticated) {
    return <Navigate to="/login-shop" replace />;
  } else if (currentShop.role !== "seller") {
    return <Navigate to="/" replace />;
  }
  return children;
};
