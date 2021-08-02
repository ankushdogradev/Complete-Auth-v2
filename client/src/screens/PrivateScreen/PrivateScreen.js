import React from "react";
import { signout } from "../../components/Auth/Store";
import "./PrivateScreen.scss";

const PrivateScreen = ({ history }) => {
  const logout = (e) => {
    signout(() => {
      history.push("/login-register");
    });
  };
  return (
    <>
      <h1>Private Screen</h1>
      <button onClick={logout}>Logout</button>
    </>
  );
};

export default PrivateScreen;
