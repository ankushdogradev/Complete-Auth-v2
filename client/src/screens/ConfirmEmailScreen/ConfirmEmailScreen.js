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
          `http://127.0.0.1:5000/api/account-activation/${activationToken}`
        );
        if (data.user.isVerify) {
          console.log("Redirecting... to /login-register");
          // return <Redirect to="/login-register" />;
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
        console.log("Error >>> ", error.response.data.error);
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
