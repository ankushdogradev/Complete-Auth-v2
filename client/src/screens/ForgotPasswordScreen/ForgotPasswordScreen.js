// Impiment forgot password fast
// then setup protect route after watching this video: https://www.youtube.com/watch?v=h7oVLne3J8Y&t=969s
import React, { useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./ForgotPasswordScreen.scss";

const ForgotPasswordScreen = () => {
  const [email, setEmail] = useState("");

  const forgot = async (e) => {
    e.preventDefault();
    console.log("Email sent");

    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };

      const { data } = await axios.put(
        "https://complete-auth-v2.herokuapp.com/api/forgot-password",
        { email },
        config
      );

      toast.info(`${data.message}`, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    } catch (error) {
      console.log(error);
      toast.error(`${error.response.data.error}`, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  };

  return (
    <>
      <div className="fcontainer">
        <ToastContainer />
        <div className="forgot-container">
          <h1>Reset Password</h1>
          <p>
            Enter the email associated with your account and we'll send an email
            with instructions to reset toir pasword.
          </p>
          <form onSubmit={forgot}>
            <input
              type="email"
              required
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button type="submit">Send Link</button>
          </form>
        </div>
      </div>
    </>
  );
};

export default ForgotPasswordScreen;
