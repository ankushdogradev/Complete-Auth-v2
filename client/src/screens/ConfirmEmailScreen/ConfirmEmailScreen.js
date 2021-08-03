import React, { useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./ConfirmEmailScreen.scss";

const ConfirmEmailScreen = ({ match, history }) => {
  const activationToken = match.params.activationToken;

  useEffect(() => {
    const activate = async () => {
      try {
        const { data } = await axios.put(
          `https://complete-auth-v2.herokuapp.com/api/account-activation/${activationToken}`
        );
        if (data.user.isVerify) {
          toast.success(`Email Verified, you will be redirected shortly`, {
            position: "top-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
          window.setTimeout(() => {
            return history.push("/login-register");
          }, 3000);
        }
      } catch (error) {
        console.log("Error:", error);
        toast.error(`${error.response.data.error}`, {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      }
    };

    activate();
  }, [activationToken, history]);
  return (
    <>
      <div className="confirm-bg">
        <img src="/images/verify-bg.svg" alt="🕕" />
      </div>
      <ToastContainer />
    </>
  );
};

export default ConfirmEmailScreen;
