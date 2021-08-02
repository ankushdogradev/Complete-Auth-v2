import React, { useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./PasswordResetScreen.scss";

const PasswordResetScreen = ({ match, history }) => {
  const [password, setPassword] = useState("");
  const regex =
    /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;

  const resetToken = match.params.resetToken;

  const reset = async () => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      const { data } = await axios.put(
        `http://127.0.0.1:5000/api/reset-password`,
        { resetPasswordToken: resetToken, password },
        config
      );
      toast.success(
        `Reset Password Successfull, you will be redirected shortly.`,
        {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        }
      );
      window.setTimeout(() => {
        return history.push("/login-register");
      }, 3000);
    } catch (error) {
      console.log(error);
      toast.error(`${error.response.data.error}, Try again`, {
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

  const resetHandler = (e) => {
    e.preventDefault();

    !regex.test(password)
      ? toast.error(
          "Password must contain atleast 8 characters & one alphabet, number & special character",
          {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          }
        )
      : reset();
  };

  return (
    <>
      <div className="prcontainer">
        <ToastContainer />
        <div className="pass-reset-container">
          <h1>Reset Password </h1>

          <form onSubmit={resetHandler}>
            <input
              type="password"
              required
              placeholder="New Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button type="submit">Reset Password</button>
          </form>
        </div>
      </div>
    </>
  );
};

export default PasswordResetScreen;
