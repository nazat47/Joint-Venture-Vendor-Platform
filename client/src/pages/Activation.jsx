import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Activation = () => {
  const REACT_APP_BASE_URL = process.env.REACT_APP_BASE_URL;
  const { token } = useParams();
  const [error, setError] = useState(false);
  const navigation = useNavigate();
  useEffect(() => {
    if (token) {
      const activationEmail = async () => {
        try {
          const res = await axios.post(
            `${REACT_APP_BASE_URL}/users//activation`,
            { token }
          );
          setTimeout(() => {
            navigation("/login");
          }, 2000);
        } catch (error) {
          setError(true);
          console.log(error.message);
        }
      };
      activationEmail();
    }
  }, []);

  return (
    <div className="w-full h-screen flex justify-center items-center">
      {error ? (
        <p>Your token is expired</p>
      ) : (
        <p>Your account has been created successfully</p>
      )}
    </div>
  );
};

export default Activation;
