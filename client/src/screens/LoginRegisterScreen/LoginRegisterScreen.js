import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { authenticate, isAuth } from "../../components/Auth/Store";
import Google from "../../components/Auth/Google";
import Facebook from "../../components/Auth/Facebook";
import "react-toastify/dist/ReactToastify.css";
import "./LoginRegisterScreen.scss";

const LoginRegisterScreen = ({ history }) => {
  const [registerUsername, setRegisterUsername] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [registerConfirmPassword, setRegisterConfirmPassword] = useState("");

  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // Overlay Animation
  const [isActive, setActive] = useState(false);

  const regex =
    /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;

  // <--- REGISTER --->
  const register = async (name, email, password) => {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    try {
      const { data } = await axios.post(
        "https://complete-auth-v2.herokuapp.com/api/signup",
        { name, email, password },
        config
      );
      setRegisterUsername("");
      setRegisterEmail("");
      setRegisterPassword("");
      setRegisterConfirmPassword("");
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

  const registerHandler = (e) => {
    e.preventDefault();

    !regex.test(registerPassword)
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
      : registerPassword !== registerConfirmPassword
      ? toast.error("Passwords do not match!", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        })
      : register(registerUsername, registerEmail, registerPassword);
  };

  // <--- LOGIN --->
  const login = async (email, password) => {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    try {
      const { data } = await axios.post(
        "https://complete-auth-v2.herokuapp.com/api/signin",
        { email, password },
        config
      );
      setLoginEmail("");
      setLoginPassword("");

      if (data.user.isVerify) {
        toast.info(`Welcome! ${data.user.name}`, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        authenticate(data, () => {
          isAuth() && isAuth().isAdmin
            ? history.push("/admin")
            : history.push("/");
        });
      } else if (!data.user.isVerify) {
        toast.info(`Verification Email has been sent to ${data.user.email}`, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      }
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

  const loginHandler = (e) => {
    e.preventDefault();
    login(loginEmail, loginPassword);
  };

  // <--- GOOGLE --->
  const informParent = (data) => {
    authenticate(data, () => {
      isAuth() && isAuth().isAdmin ? history.push("/admin") : history.push("/");
    });
  };

  // Overlay Animation
  const registerAni = () => {
    setActive(true);
  };
  const loginAni = () => {
    setActive(false);
  };
  return (
    <>
      <div className="main">
        <ToastContainer />
        <div
          className={isActive ? "container right-pannel-active" : "container"}
        >
          <div className="form-container register-container">
            <form onSubmit={registerHandler}>
              <h1>Create Account</h1>
              <div className="social-container">
                <Google className="social" informParent={informParent} />
                <Facebook
                  className="social facebook"
                  informParent={informParent}
                />
              </div>
              <span>or use your email for registration</span>
              <input
                type="text"
                required
                placeholder="Name"
                value={registerUsername}
                onChange={(e) => setRegisterUsername(e.target.value)}
              />
              <input
                type="email"
                required
                placeholder="Email"
                value={registerEmail}
                onChange={(e) => setRegisterEmail(e.target.value)}
              />
              <input
                type="password"
                required
                placeholder="Password"
                value={registerPassword}
                onChange={(e) => setRegisterPassword(e.target.value)}
              />
              <input
                type="password"
                required
                placeholder="Confirm Password"
                value={registerConfirmPassword}
                onChange={(e) => setRegisterConfirmPassword(e.target.value)}
              />
              <button type="submit">Register</button>
            </form>
          </div>
          <div className="form-container login-container">
            <form onSubmit={loginHandler}>
              <h1>Login</h1>
              <div className="social-container">
                <Google className="social" informParent={informParent} />
                <Facebook
                  className="social facebook"
                  informParent={informParent}
                />
              </div>
              <span>or use your account</span>
              <input
                type="email"
                required
                placeholder="Email"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
              />
              <input
                type="password"
                required
                placeholder="Password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
              />
              <Link to="/forgot-password">Forgot your password?</Link>
              <button type="submit">Login</button>
            </form>
          </div>
          <div className="overlay-container">
            <div className="overlay">
              <div className="overlay-panel overlay-left">
                <h1>Welcome Back</h1>
                <div className="undraw">
                  <img src="./images/login.svg" alt="Login" />
                </div>
                <button onClick={loginAni} className="ghost-btn login">
                  Login
                </button>
              </div>
              <div className="overlay-panel overlay-right">
                <h1>CREATE ACCOUNT</h1>
                <div className="undraw">
                  <img src="./images/register.svg" alt="Register" />
                </div>
                <button onClick={registerAni} className="ghost-btn register">
                  Register
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginRegisterScreen;
