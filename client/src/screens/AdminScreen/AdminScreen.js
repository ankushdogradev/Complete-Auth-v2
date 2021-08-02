import React from "react";
import { signout } from "../../components/Auth/Store";
import "./AdminScreen.scss";

const AdminScreen = ({ history }) => {
  const logout = (e) => {
    signout(() => {
      history.push("/login-register");
    });
  };
  return (
    <>
      <h1>Admin Screen</h1>
      <button onClick={logout}>Logout</button>
    </>
  );
};

export default AdminScreen;
