import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import Loader from "../components/layout/Loader";

export const AdminProtected = ({ children }) => {
  const { isAuthenticated, currentUser, loading } = useSelector(
    (state) => state.user
  );

  // if (loading) {
  //   return <Loader />;
  // } else {
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  } else if (currentUser.role !== "admin") {
    return <Navigate to="/" replace />;
  }
  return children;
};
