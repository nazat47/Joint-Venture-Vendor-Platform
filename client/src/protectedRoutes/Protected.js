import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

export const Protected = ({ children }) => {
  const { isAuthenticated, loading } = useSelector((state) => state.user);
  if (loading === false) {
    return !isAuthenticated ? <Navigate to="/login" replace /> : children;
  }
};
