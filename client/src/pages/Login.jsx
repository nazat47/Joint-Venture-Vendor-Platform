import { useEffect } from "react";
import Login from "../components/login/Login";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
const LoginPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state) => state.user);
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, []);
  return <div>{!isAuthenticated && <Login />}</div>;
};

export default LoginPage;
